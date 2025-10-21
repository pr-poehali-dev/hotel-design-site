import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta, date

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
        
        # Временная отладка: собираем все уникальные room_name из Bnovo
        unique_room_names = set()
        for b in all_bookings:
            if isinstance(b, dict) and b.get('room_name'):
                unique_room_names.add(str(b.get('room_name')))
        print(f"[DEBUG] Unique room_name values from Bnovo: {sorted(unique_room_names)}")
        
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
            room_number_original = str(room_name_raw) if room_name_raw else ''
            
            # Маппинг для разных форматов названий из Bnovo
            room_number = room_number_original
            if 'Поклонная 9-816' in room_number_original:
                room_number = '816'
            elif 'Апартамент студия Матч Поинт' in room_number_original:
                room_number = '1157'  # или другой номер если известен
            elif 'Мат Поинт 1157' in room_number_original:
                room_number = '1157'
            elif 'Энитэо-193' in room_number_original:
                room_number = '193'
            
            room_number_escaped = room_number.replace("'", "''")
            
            # Находим наш апартамент по номеру
            cur.execute(
                f"SELECT id, number, bnovo_name FROM t_p9202093_hotel_design_site.rooms WHERE number = '{room_number_escaped}'"
            )
            room = cur.fetchone()
            
            if not room:
                if skipped_bookings == 0:
                    print(f"[DEBUG] Room not found for room_number='{room_number}', booking fields: {list(booking.keys())[:20]}")
                skipped_bookings += 1
                continue
            
            # Используем номер апартамента как ID (как в отчетности для собственников)
            apartment_id = room['number']
            room_id = room['id']  # UUID для availability_calendar
            
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
        
        # Обновляем новый календарь для всех существующих бронирований из Bnovo
        print("[CRON] Updating NEW calendar_bnovo for existing Bnovo bookings...")
        
        # Сначала очищаем старые записи из нового календаря
        cur.execute("""
            DELETE FROM t_p9202093_hotel_design_site.calendar_bnovo 
            WHERE booking_id IN (SELECT id FROM t_p9202093_hotel_design_site.bookings WHERE source = 'bnovo')
        """)
        
        # Получаем все бронирования и заполняем новый календарь
        cur.execute("""
            SELECT b.id, b.bnovo_id, b.apartment_id, b.check_in, b.check_out, b.guest_name, b.total_amount
            FROM t_p9202093_hotel_design_site.bookings b
            WHERE b.source = 'bnovo'
              AND b.apartment_id IN (SELECT number FROM t_p9202093_hotel_design_site.rooms)
        """)
        bnovo_bookings = cur.fetchall()
        
        calendar_inserts = []
        for booking in bnovo_bookings:
            booking_id = booking['id']
            bnovo_id = booking['bnovo_id'] or ''
            apartment_id = booking['apartment_id']
            guest_name = (booking['guest_name'] or '').replace("'", "''")
            check_in = booking['check_in'] if isinstance(booking['check_in'], date) else datetime.strptime(booking['check_in'], '%Y-%m-%d').date()
            check_out = booking['check_out'] if isinstance(booking['check_out'], date) else datetime.strptime(booking['check_out'], '%Y-%m-%d').date()
            price = booking['total_amount'] or 0
            
            current_date = check_in
            while current_date < check_out:
                calendar_inserts.append(f"('{apartment_id}', '{current_date}', false, '{booking_id}', '{bnovo_id}', '{guest_name}', {price})")
                current_date += timedelta(days=1)
        
        if calendar_inserts:
            # Удаляем дубликаты (берём последнее бронирование для каждой даты/апартамента)
            unique_inserts = {}
            for insert_str in calendar_inserts:
                parts = insert_str.strip('()').split(',')
                apartment_id_val = parts[0].strip().strip("'")
                date_val = parts[1].strip().strip("'")
                key = f"{apartment_id_val}_{date_val}"
                unique_inserts[key] = insert_str
            
            # Вставляем пачками по 500 записей
            batch_size = 500
            unique_list = list(unique_inserts.values())
            for i in range(0, len(unique_list), batch_size):
                batch = unique_list[i:i+batch_size]
                cur.execute(f"""
                    INSERT INTO t_p9202093_hotel_design_site.calendar_bnovo 
                    (apartment_id, date, is_available, booking_id, bnovo_id, guest_name, price)
                    VALUES {','.join(batch)}
                """)
        
        print(f"[CRON] NEW calendar_bnovo updated: {len(unique_inserts)} date entries created")
        
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