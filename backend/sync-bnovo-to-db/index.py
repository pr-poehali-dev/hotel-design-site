import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Синхронизация бронирований и апартаментов из Bnovo в базу данных
    Args: event - dict с httpMethod
          context - объект с атрибутами request_id
    Returns: HTTP response с результатом синхронизации
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        import psycopg2
        import psycopg2.extras
        
        # Получаем данные для подключения
        database_url = os.environ.get('DATABASE_URL', '')
        account_id = os.environ.get('BNOVO_ACCOUNT_ID', '')
        password = os.environ.get('BNOVO_PASSWORD', '')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        # Авторизация в Bnovo
        auth_url = 'https://api.pms.bnovo.ru/api/v1/auth'
        auth_payload = {
            'id': int(account_id),
            'password': password
        }
        
        auth_request = urllib.request.Request(
            auth_url,
            data=json.dumps(auth_payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(auth_request, timeout=30) as auth_response:
            auth_data = json.loads(auth_response.read().decode())
        
        jwt_token = auth_data.get('data', {}).get('access_token')
        
        if not jwt_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to get Bnovo token'})
            }
        
        # Получаем бронирования
        date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        date_to = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d')
        
        params = urllib.parse.urlencode({
            'date_from': date_from,
            'date_to': date_to,
            'limit': 20,
            'offset': 0
        })
        bookings_url = f'https://api.pms.bnovo.ru/api/v1/bookings?{params}'
        
        bookings_request = urllib.request.Request(
            bookings_url,
            headers={
                'Authorization': f'Bearer {jwt_token}',
                'Accept': 'application/json'
            }
        )
        
        with urllib.request.urlopen(bookings_request, timeout=30) as response:
            bookings_data = json.loads(response.read().decode())
        
        # Bnovo возвращает данные в формате {'data': {'bookings': [...]}} или {'bookings': [...]}
        if isinstance(bookings_data, dict):
            # Сначала проверяем data.bookings
            if 'data' in bookings_data and isinstance(bookings_data['data'], dict):
                bookings_list = bookings_data['data'].get('bookings', [])
            else:
                # Если нет, то просто bookings
                bookings_list = bookings_data.get('bookings', bookings_data.get('data', []))
        else:
            bookings_list = bookings_data
        
        # Проверяем, что bookings_list это список
        if not isinstance(bookings_list, list):
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Invalid bookings data format',
                    'type': str(type(bookings_list)),
                    'raw_response': str(bookings_data)[:500]
                })
            }
        
        # Подключаемся к базе данных
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        synced_bookings = 0
        synced_rooms = 0
        updated_calendar = 0
        
        # Синхронизируем бронирования
        for booking in bookings_list:
            if not isinstance(booking, dict):
                continue
            bnovo_booking_id = booking.get('id')
            room_id = str(booking.get('room_id', ''))
            
            # Проверяем, существует ли бронирование
            cur.execute(
                "SELECT id FROM t_p9202093_hotel_design_site.bookings WHERE bnovo_id = %s",
                (bnovo_booking_id,)
            )
            existing = cur.fetchone()
            
            # Извлекаем даты из разных возможных полей
            check_in = booking.get('check_in') or booking.get('arrival') or booking.get('check_in_date')
            check_out = booking.get('check_out') or booking.get('departure') or booking.get('check_out_date')
            
            # Извлекаем данные гостя из вложенного объекта если есть
            guest_data = booking.get('guest', {})
            if isinstance(guest_data, dict):
                guest_name = guest_data.get('name', guest_data.get('full_name', ''))
                guest_email = guest_data.get('email', '')
                guest_phone = guest_data.get('phone', '')
            else:
                guest_name = str(guest_data) if guest_data else ''
                guest_email = ''
                guest_phone = ''
            
            if not existing and check_in and check_out:
                # Создаём новое бронирование
                booking_id = f"bnovo_{bnovo_booking_id}"
                
                cur.execute("""
                    INSERT INTO t_p9202093_hotel_design_site.bookings 
                    (id, bnovo_id, apartment_id, check_in, check_out, guest_name, guest_email, 
                     guest_phone, guests_count, accommodation_amount, total_amount, status, source, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (
                    booking_id,
                    bnovo_booking_id,
                    room_id,
                    check_in,
                    check_out,
                    guest_name,
                    guest_email,
                    guest_phone,
                    booking.get('guests', booking.get('guests_count', 1)),
                    booking.get('amount', booking.get('price', 0)),
                    booking.get('amount', booking.get('total', 0)),
                    'confirmed',
                    'bnovo',
                    json.dumps(booking, ensure_ascii=False)[:500]  # Сохраняем полные данные в notes
                ))
                synced_bookings += 1
                
                # Обновляем календарь доступности
                if check_in and check_out and room_id:
                    cur.execute("""
                        INSERT INTO t_p9202093_hotel_design_site.availability_calendar 
                        (room_id, date, is_available, booking_id, price)
                        SELECT %s, generate_series(%s::date, %s::date - interval '1 day', '1 day')::date, false, %s, %s
                        ON CONFLICT (room_id, date) 
                        DO UPDATE SET is_available = false, booking_id = EXCLUDED.booking_id
                    """, (room_id, check_in, check_out, booking_id, booking.get('price', 0)))
                    updated_calendar += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'synced_bookings': synced_bookings,
                'synced_rooms': synced_rooms,
                'updated_calendar': updated_calendar,
                'total_bookings_from_bnovo': len(bookings_list)
            }, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            })
        }