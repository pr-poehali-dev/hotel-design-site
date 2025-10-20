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
        skipped_bookings = 0
        updated_calendar = 0
        
        # Синхронизируем бронирования  
        for booking in all_bookings:
            if not isinstance(booking, dict):
                continue
            
            bnovo_booking_id = booking.get('id')
            if not bnovo_booking_id:
                skipped_bookings += 1
                continue
            
            # Получаем room_name из Bnovo (это номер апартамента, например: "1401", "906")
            room_name_raw = booking.get('room_name', '')
            room_number = str(room_name_raw).replace("'", "''") if room_name_raw else ''
            
            # Находим наш апартамент по номеру
            cur.execute(
                f"SELECT id, number, bnovo_name FROM t_p9202093_hotel_design_site.rooms WHERE number = '{room_number}'"
            )
            room = cur.fetchone()
            
            if not room:
                if skipped_bookings == 0:
                    print(f"[DEBUG] Room not found for room_number='{room_number}', booking fields: {list(booking.keys())[:20]}")
                skipped_bookings += 1
                continue
            
            # Используем номер апартамента как ID (как в отчетности для собственников)
            apartment_id = room['number']
            
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
                f"SELECT id FROM t_p9202093_hotel_design_site.bookings WHERE bnovo_id = '{bnovo_booking_id}'"
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
                
                guest_name_escaped = guest_name.replace("'", "''")
                guest_email_escaped = guest_email.replace("'", "''")
                guest_phone_escaped = guest_phone.replace("'", "''")
                notes_escaped = json.dumps(booking, ensure_ascii=False)[:500].replace("'", "''")
                
                cur.execute(f"""
                    INSERT INTO t_p9202093_hotel_design_site.bookings 
                    (id, bnovo_id, apartment_id, check_in, check_out, guest_name, guest_email, 
                     guest_phone, guests_count, accommodation_amount, total_amount, status, source, notes)
                    VALUES ('{booking_id}', '{bnovo_booking_id}', '{apartment_id}', '{check_in}', '{check_out}', 
                            '{guest_name_escaped}', '{guest_email_escaped}', '{guest_phone_escaped}', 
                            {adults + children}, {booking.get('amount', 0)}, {booking.get('amount', 0)}, 
                            'confirmed', 'bnovo', '{notes_escaped}')
                    ON CONFLICT (id) DO NOTHING
                """)
                synced_bookings += 1
                
                # Обновляем календарь доступности
                cur.execute(f"""
                    INSERT INTO t_p9202093_hotel_design_site.availability_calendar 
                    (room_id, date, is_available, booking_id, price)
                    SELECT '{apartment_id}', generate_series('{check_in}'::date, '{check_out}'::date - interval '1 day', '1 day')::date, false, '{booking_id}', {booking.get('amount', 0)}
                    ON CONFLICT (room_id, date) 
                    DO UPDATE SET is_available = false, booking_id = EXCLUDED.booking_id
                """)
                updated_calendar += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Логируем результат
        sync_result = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'synced_bookings': synced_bookings,
            'updated_calendar': updated_calendar,
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