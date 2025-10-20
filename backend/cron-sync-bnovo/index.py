import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Автоматическая синхронизация бронирований из Bnovo (запускается по расписанию)
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
        
        # Получаем бронирования за расширенный период (60 дней назад и 180 дней вперед)
        date_from = (datetime.now() - timedelta(days=60)).strftime('%Y-%m-%d')
        date_to = (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d')
        
        # Получаем бронирования из Bnovo API
        all_bookings = []
        offset = 0
        max_iterations = 10
        
        for _ in range(max_iterations):
            params = urllib.parse.urlencode({
                'date_from': date_from,
                'date_to': date_to,
                'limit': 20,
                'offset': offset
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
            
            if isinstance(bookings_data, dict):
                if 'data' in bookings_data and isinstance(bookings_data['data'], dict):
                    batch = bookings_data['data'].get('bookings', [])
                else:
                    batch = bookings_data.get('bookings', bookings_data.get('data', []))
            else:
                batch = bookings_data
            
            if not isinstance(batch, list) or len(batch) == 0:
                break
            
            all_bookings.extend(batch)
            offset += 20
            
            if len(batch) < 20:
                break
        
        # Старый код для бэкапа (закомментирован)
        # all_bookings = []
        # offset = 0
        # max_iterations = 2
        
        # for _ in range(max_iterations):
        #     params = urllib.parse.urlencode({
        #         'date_from': date_from,
        #         'date_to': date_to,
        #         'limit': 20,
        #         'offset': offset
        #     })
        #     bookings_url = f'https://api.pms.bnovo.ru/api/v1/bookings?{params}'
        #     
        #     bookings_request = urllib.request.Request(
        #         bookings_url,
        #         headers={
        #             'Authorization': f'Bearer {jwt_token}',
        #             'Accept': 'application/json'
        #         }
        #     )
        #     
        #     with urllib.request.urlopen(bookings_request, timeout=30) as response:
        #         bookings_data = json.loads(response.read().decode())
        #     
        #     if isinstance(bookings_data, dict):
        #         if 'data' in bookings_data and isinstance(bookings_data['data'], dict):
        #             batch = bookings_data['data'].get('bookings', [])
        #         else:
        #             batch = bookings_data.get('bookings', bookings_data.get('data', []))
        #     else:
        #         batch = bookings_data
        #     
        #     if not isinstance(batch, list) or len(batch) == 0:
        #         break
        #     
        #     all_bookings.extend(batch)
        #     offset += 20
        #     
        #     if len(batch) < 20:
        #         break
        
        # Подключаемся к базе данных
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        synced_bookings = 0
        updated_calendar = 0
        skipped_bookings = 0
        
        # Синхронизируем бронирования  
        for booking in all_bookings:
            if not isinstance(booking, dict):
                continue
            
            bnovo_booking_id = booking.get('id')
            if not bnovo_booking_id:
                skipped_bookings += 1
                continue
            
            # Получаем room_id из Bnovo (это bnovo_id апартамента)
            bnovo_room_id = booking.get('room_id')
            
            # Находим наш апартамент по bnovo_id
            cur.execute(
                "SELECT id, number FROM t_p9202093_hotel_design_site.rooms WHERE bnovo_id = %s",
                (bnovo_room_id,)
            )
            room = cur.fetchone()
            
            if not room:
                skipped_bookings += 1
                continue
            
            apartment_id = room['id']
            
            # Извлекаем даты из dates объекта
            dates = booking.get('dates', {})
            check_in_raw = dates.get('arrival', '') or booking.get('check_in', '')
            check_out_raw = dates.get('departure', '') or booking.get('check_out', '')
            
            # Конвертируем даты из формата "2025-10-20 15:00:00+03" в "2025-10-20"
            check_in = check_in_raw.split(' ')[0] if check_in_raw else ''
            check_out = check_out_raw.split(' ')[0] if check_out_raw else ''
            
            if not check_in or not check_out:
                if skipped_bookings == 0:
                    print(f"[DEBUG] No dates in booking details, fields: {list(booking.keys())[:15]}")
                skipped_bookings += 1
                continue
            
            # Проверяем, существует ли бронирование
            cur.execute(
                "SELECT id FROM t_p9202093_hotel_design_site.bookings WHERE bnovo_id = %s",
                (bnovo_booking_id,)
            )
            existing = cur.fetchone()
            
            # Извлекаем данные гостя из customer объекта
            customer = booking.get('customer', {})
            if isinstance(customer, dict):
                name = customer.get('name', '')
                surname = customer.get('surname', '')
                guest_name = f"{name} {surname}".strip()
                guest_email = customer.get('email', '')
                guest_phone = customer.get('phone', '')
            else:
                guest_name = ''
                guest_email = ''
                guest_phone = ''
            
            if not existing:
                # Создаём новое бронирование
                booking_id = f"bnovo_{bnovo_booking_id}"
                
                extra = booking.get('extra', {})
                adults = extra.get('adults', 2)
                children = extra.get('children', 0)
                
                cur.execute("""
                    INSERT INTO t_p9202093_hotel_design_site.bookings 
                    (id, bnovo_id, apartment_id, check_in, check_out, guest_name, guest_email, 
                     guest_phone, guests_count, accommodation_amount, total_amount, status, source, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (
                    booking_id,
                    bnovo_booking_id,
                    apartment_id,
                    check_in,
                    check_out,
                    guest_name,
                    guest_email,
                    guest_phone,
                    adults + children,
                    booking.get('amount', 0),
                    booking.get('amount', 0),
                    'confirmed',
                    'bnovo',
                    json.dumps(booking, ensure_ascii=False)[:500]
                ))
                synced_bookings += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Логируем результат
        sync_result = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'synced_bookings': synced_bookings,
            'skipped_bookings': skipped_bookings,
            'total_bookings_from_bnovo': len(all_bookings)
        }
        
        print(f"[CRON] Bnovo sync completed: {json.dumps(sync_result)}")
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(sync_result, ensure_ascii=False)
        }
    
    except Exception as e:
        error_result = {
            'success': False,
            'timestamp': datetime.now().isoformat(),
            'error': str(e),
            'error_type': type(e).__name__
        }
        
        print(f"[CRON] Bnovo sync failed: {json.dumps(error_result)}")
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(error_result)
        }