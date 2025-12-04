import json
import os
import uuid
import secrets
import string
from typing import Dict, Any, Tuple
from datetime import datetime, timedelta
import requests

def calculate_booking_finances(apartment_id: str, total_amount: float, cur) -> dict:
    '''Расчёт финансовых показателей бронирования для инвестора'''
    
    # Получаем ставку комиссии собственника (по умолчанию 20%)
    cur.execute(f"""
        SELECT commission_rate 
        FROM t_p9202093_hotel_design_site.apartment_owners 
        WHERE apartment_id = '{apartment_id}'
    """)
    owner_data = cur.fetchone()
    management_commission_rate = owner_data['commission_rate'] if owner_data else 20.0
    
    # Расчёт показателей
    aggregator_commission_rate = 25.0
    aggregator_commission = total_amount * (aggregator_commission_rate / 100)
    
    # Налог и банковская комиссия (7% от суммы после комиссии агрегатора)
    tax_rate = 7.0
    tax_and_bank = (total_amount - aggregator_commission) * (tax_rate / 100)
    
    remainder_before_management = total_amount - aggregator_commission - tax_and_bank
    management_commission = remainder_before_management * (management_commission_rate / 100)
    remainder_before_expenses = remainder_before_management - management_commission
    
    # Операционные расходы по умолчанию
    operating_expenses = 3500.0
    owner_funds = max(0, remainder_before_expenses - operating_expenses)
    
    return {
        'aggregator_commission': round(aggregator_commission_rate, 2),
        'tax_and_bank_commission': round(tax_and_bank, 2),
        'remainder_before_management': round(remainder_before_management, 2),
        'management_commission': round(management_commission, 2),
        'remainder_before_expenses': round(remainder_before_expenses, 2),
        'operating_expenses': round(operating_expenses, 2),
        'owner_funds': round(owner_funds, 2)
    }

def generate_password(length: int = 8) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def clean_string(s: str) -> str:
    import re
    return re.sub(r'[^0-9a-zA-Z@._]', '', s)

def create_or_get_guest(cur, guest_name: str, guest_email: str, guest_phone: str) -> Tuple[str, str, str]:
    if not guest_email and not guest_phone:
        return '', '', ''
    
    clean_phone = clean_string(guest_phone) if guest_phone else ''
    
    query = f"""
        SELECT id, login, email, phone, password, notes 
        FROM t_p9202093_hotel_design_site.guests 
        WHERE regexp_replace(phone, '[^0-9]', '', 'g') = '{clean_phone}'
        AND (notes IS NULL OR notes NOT LIKE '%[ДУБЛИКАТ]%')
        LIMIT 1
    """
    cur.execute(query)
    existing_guest = cur.fetchone()
    
    if existing_guest:
        guest_id = existing_guest['id']
        login = existing_guest['login'] if existing_guest.get('login') else (existing_guest['email'] if existing_guest['email'] else existing_guest['phone'])
        password = existing_guest.get('password') if existing_guest.get('password') else ''
        print(f'Found existing guest: {guest_id}, login: {login}')
        return guest_id, login, password
    
    guest_id = str(uuid.uuid4())
    password = generate_password()
    
    email_for_db = guest_email if guest_email and '@' in guest_email else clean_phone
    login = clean_string(guest_email if guest_email and '@' in guest_email else guest_phone)
    
    guest_name_escaped = guest_name.replace("'", "''")
    email_escaped = email_for_db.replace("'", "''")
    phone_escaped = guest_phone.replace("'", "''")
    login_escaped = login.replace("'", "''")
    
    insert_query = f"INSERT INTO t_p9202093_hotel_design_site.guests (id, name, email, phone, login, password, bonus_points, is_vip) VALUES ('{guest_id}', '{guest_name_escaped}', '{email_escaped}', '{phone_escaped}', '{login_escaped}', '{password}', 0, false)"
    cur.execute(insert_query)
    
    print(f'Created new guest: {guest_id}, login: {login}, password: {password}')
    
    return guest_id, login, password

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
        bnovo_password = os.environ.get('BNOVO_PASSWORD', '')
        
        print(f'Starting sync: database_url={bool(database_url)}, account_id={bool(account_id)}, password={bool(bnovo_password)}')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        if not account_id or not bnovo_password:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'BNOVO credentials not configured'})
            }
        
        # Авторизация в Bnovo
        auth_url = 'https://api.pms.bnovo.ru/api/v1/auth'
        auth_payload = {
            'id': int(account_id),
            'password': bnovo_password
        }
        
        auth_response = requests.post(
            auth_url,
            json=auth_payload,
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout=30
        )
        auth_response.raise_for_status()
        auth_data = auth_response.json()
        
        jwt_token = auth_data.get('data', {}).get('access_token')
        
        if not jwt_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to get Bnovo token'})
            }
        
        # Получаем бронирования с пагинацией
        date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        date_to = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d')
        
        all_bookings = []
        offset = 0
        limit = 20
        
        while True:
            params = {
                'date_from': date_from,
                'date_to': date_to,
                'limit': limit,
                'offset': offset
            }
            
            bookings_response = requests.get(
                'https://api.pms.bnovo.ru/api/v1/bookings',
                params=params,
                headers={
                    'Authorization': f'Bearer {jwt_token}',
                    'Accept': '*/*',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout=30
            )
            
            bookings_response.raise_for_status()
            bookings_data = bookings_response.json()
            
            # Bnovo возвращает данные в формате {'data': {'bookings': [...]}} или {'bookings': [...]}
            if isinstance(bookings_data, dict):
                # Сначала проверяем data.bookings
                if 'data' in bookings_data and isinstance(bookings_data['data'], dict):
                    current_batch = bookings_data['data'].get('bookings', [])
                else:
                    # Если нет, то просто bookings
                    current_batch = bookings_data.get('bookings', bookings_data.get('data', []))
            else:
                current_batch = bookings_data
            
            # Проверяем, что current_batch это список
            if not isinstance(current_batch, list):
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Invalid bookings data format',
                        'type': str(type(current_batch)),
                        'raw_response': str(bookings_data)[:500]
                    })
                }
            
            if not current_batch:
                break
            
            all_bookings.extend(current_batch)
            
            # Если получили меньше чем limit, значит это последняя страница
            if len(current_batch) < limit:
                break
            
            offset += limit
        
        bookings_list = all_bookings
        
        # Подключаемся к базе данных
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        synced_bookings = 0
        synced_rooms = 0
        updated_calendar = 0
        created_guests = 0
        
        # Извлекаем уникальные room_id из бронирований и создаем комнаты
        cur.execute("SELECT bnovo_id FROM t_p9202093_hotel_design_site.rooms WHERE bnovo_id IS NOT NULL")
        existing_room_bnovo_ids = set(row['bnovo_id'] for row in cur.fetchall())
        
        unique_room_ids = set()
        for booking in bookings_list:
            if isinstance(booking, dict):
                room_id = booking.get('room_id')
                if room_id and room_id not in existing_room_bnovo_ids:
                    unique_room_ids.add(room_id)
        
        for bnovo_room_id in unique_room_ids:
            room_id = f'apt-{bnovo_room_id}'
            try:
                cur.execute("""
                    INSERT INTO t_p9202093_hotel_design_site.rooms (id, bnovo_id)
                    VALUES (%s, %s)
                    ON CONFLICT (id) DO UPDATE SET bnovo_id = EXCLUDED.bnovo_id
                """, (room_id, bnovo_room_id))
                synced_rooms += 1
            except Exception as e:
                print(f'Failed to insert room {bnovo_room_id}: {str(e)}')
        
        conn.commit()
        
        # Получаем все существующие bnovo_id за один запрос
        cur.execute(
            "SELECT bnovo_id FROM t_p9202093_hotel_design_site.bookings WHERE bnovo_id IS NOT NULL"
        )
        existing_bnovo_ids = set(row['bnovo_id'] for row in cur.fetchall())
        
        # Создаем маппинг bnovo_id -> internal room id
        cur.execute(
            "SELECT id, bnovo_id FROM t_p9202093_hotel_design_site.rooms WHERE bnovo_id IS NOT NULL"
        )
        bnovo_to_room_id = {row['bnovo_id']: row['id'] for row in cur.fetchall()}
        
        # Создаём гостей для ВСЕХ бронирований из Bnovo (новых и существующих)
        print(f'Processing {len(bookings_list)} bookings from Bnovo to create/update guests')
        
        for booking in bookings_list:
            if not isinstance(booking, dict):
                continue
            
            try:
                guest_data = booking.get('guest', {})
                if isinstance(guest_data, dict):
                    guest_name = guest_data.get('name', guest_data.get('full_name', ''))
                    guest_email = guest_data.get('email', '')
                    guest_phone = guest_data.get('phone', '')
                else:
                    guest_name = str(guest_data) if guest_data else ''
                    guest_email = ''
                    guest_phone = ''
                
                if guest_name and (guest_email or guest_phone):
                    guest_id, guest_login, guest_password = create_or_get_guest(cur, guest_name, guest_email, guest_phone)
                    if guest_id:
                        created_guests += 1
            except Exception as e:
                print(f'Failed to process guest from booking {booking.get("id", "unknown")}: {str(e)}')
                import traceback
                traceback.print_exc()
        
        # Подготавливаем данные для batch insert
        bookings_to_insert = []
        calendar_updates = []
        
        for booking in bookings_list:
            if not isinstance(booking, dict):
                continue
                
            bnovo_booking_id = booking.get('id')
            if bnovo_booking_id in existing_bnovo_ids:
                continue
                
            bnovo_room_id = booking.get('room_id')
            room_id = bnovo_to_room_id.get(bnovo_room_id, str(bnovo_room_id)) if bnovo_room_id else ''
            check_in = booking.get('check_in') or booking.get('arrival') or booking.get('check_in_date')
            check_out = booking.get('check_out') or booking.get('departure') or booking.get('check_out_date')
            
            if not check_in or not check_out:
                continue
            
            # Извлекаем данные гостя
            guest_data = booking.get('guest', {})
            if isinstance(guest_data, dict):
                guest_name = guest_data.get('name', guest_data.get('full_name', ''))
                guest_email = guest_data.get('email', '')
                guest_phone = guest_data.get('phone', '')
            else:
                guest_name = str(guest_data) if guest_data else ''
                guest_email = ''
                guest_phone = ''
            
            booking_id = f"bnovo_{bnovo_booking_id}"
            total_amount = booking.get('amount', booking.get('total', 0))
            
            # Расчёт финансов для инвестора
            finances = calculate_booking_finances(room_id, total_amount, cur)
            
            bookings_to_insert.append((
                booking_id, bnovo_booking_id, room_id, check_in, check_out,
                guest_name, guest_email, guest_phone,
                booking.get('guests', booking.get('guests_count', 1)),
                booking.get('amount', booking.get('price', 0)),
                total_amount,
                finances['aggregator_commission'], finances['tax_and_bank_commission'],
                finances['remainder_before_management'], finances['management_commission'],
                finances['remainder_before_expenses'], finances['operating_expenses'],
                finances['owner_funds'],
                'confirmed', 'bnovo',
                json.dumps(booking, ensure_ascii=False)[:500],
                True
            ))
            
            if room_id:
                calendar_updates.append((room_id, check_in, check_out, booking_id, booking.get('price', 0)))
        
        # Batch insert бронирований
        if bookings_to_insert:
            psycopg2.extras.execute_batch(cur, """
                INSERT INTO t_p9202093_hotel_design_site.bookings 
                (id, bnovo_id, apartment_id, check_in, check_out, guest_name, guest_email, 
                 guest_phone, guests_count, accommodation_amount, total_amount,
                 aggregator_commission, tax_and_bank_commission, remainder_before_management,
                 management_commission, remainder_before_expenses, operating_expenses, owner_funds,
                 status, source, notes, show_to_guest)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
            """, bookings_to_insert, page_size=100)
            synced_bookings = len(bookings_to_insert)
        
        # Batch update календаря
        if calendar_updates:
            for room_id, check_in, check_out, booking_id, price in calendar_updates:
                cur.execute("""
                    INSERT INTO t_p9202093_hotel_design_site.availability_calendar 
                    (room_id, date, is_available, booking_id, price)
                    SELECT %s, generate_series(%s::date, %s::date - interval '1 day', '1 day')::date, false, %s, %s
                    ON CONFLICT (room_id, date) 
                    DO UPDATE SET is_available = false, booking_id = EXCLUDED.booking_id
                """, (room_id, check_in, check_out, booking_id, price))
            updated_calendar = len(calendar_updates)
        
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
                'created_guests': created_guests,
                'total_bookings_from_bnovo': len(bookings_list)
            }, ensure_ascii=False)
        }
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f'ERROR in sync-bnovo-to-db: {type(e).__name__}: {str(e)}')
        print(f'Traceback:\n{error_trace}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__,
                'traceback': error_trace
            })
        }