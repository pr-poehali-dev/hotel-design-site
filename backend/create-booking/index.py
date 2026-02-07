import json
import os
import psycopg2
import time
import secrets
import string
import uuid
from datetime import datetime
from typing import Dict, Any, Tuple

# Force redeploy

def generate_password(length: int = 8) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_or_get_guest(cursor, conn, guest_name: str, guest_email: str, guest_phone: str) -> Tuple[str, str, str]:
    search_field = guest_email if guest_email else guest_phone
    search_column = 'email' if guest_email else 'phone'
    
    query = f"SELECT id, email, phone, password FROM t_p9202093_hotel_design_site.guests WHERE {search_column} = '{search_field}'"
    cursor.execute(query)
    existing_guest = cursor.fetchone()
    
    if existing_guest:
        guest_id = existing_guest[0]
        login = existing_guest[1] if existing_guest[1] else existing_guest[2]
        password = existing_guest[3] if len(existing_guest) > 3 and existing_guest[3] else ''
        return guest_id, login, password
    
    guest_id = str(uuid.uuid4())
    password = generate_password()
    login = guest_email if guest_email else guest_phone
    
    insert_query = f"INSERT INTO t_p9202093_hotel_design_site.guests (id, name, email, phone, password, bonus_points, is_vip) VALUES ('{guest_id}', '{guest_name}', '{guest_email}', '{guest_phone}', '{password}', 0, false)"
    cursor.execute(insert_query)
    conn.commit()
    
    return guest_id, login, password

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create new booking from website form
    Args: event with httpMethod, body containing booking details
    Returns: HTTP response with created booking ID
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        apartment_id = body_data.get('apartment_id')
        check_in = body_data.get('check_in')
        check_out = body_data.get('check_out')
        guest_name = body_data.get('guest_name')
        guest_email = body_data.get('guest_email')
        guest_phone = body_data.get('guest_phone')
        adults = body_data.get('adults', 2)
        children = body_data.get('children', 0)
        source = body_data.get('source', 'website')
        
        if not all([apartment_id, check_in, check_out, guest_name, guest_email, guest_phone]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
        
        if check_in_date >= check_out_date:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Check-out must be after check-in'})
            }
        
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT COUNT(*) FROM bookings 
            WHERE apartment_id = %s::text
            AND status != 'cancelled'
            AND (
                (check_in <= %s::date AND check_out > %s::date)
                OR (check_in < %s::date AND check_out >= %s::date)
                OR (check_in >= %s::date AND check_out <= %s::date)
            )
        ''', (str(apartment_id), check_in, check_in, check_out, check_out, check_in, check_out))
        
        conflict_count = cursor.fetchone()[0]
        
        if conflict_count > 0:
            cursor.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Dates are already booked'})
            }
        
        cursor.execute(f"SELECT bnovo_name, number, price_per_night FROM t_p9202093_hotel_design_site.rooms WHERE id = '{apartment_id}'")
        room_data = cursor.fetchone()
        apartment_name = room_data[0] if room_data and room_data[0] else (room_data[1] if room_data else apartment_id)
        price_per_night = float(room_data[2]) if room_data and room_data[2] else 8500
        
        guests_count = adults + children
        booking_id = str(int(time.time() * 1000))
        
        nights = (check_out_date - check_in_date).days
        total_amount = price_per_night * nights
        
        guest_id, guest_login, guest_password = create_or_get_guest(cursor, conn, guest_name, guest_email, guest_phone)
        
        cursor.execute('''
            INSERT INTO t_p9202093_hotel_design_site.bookings 
            (id, apartment_id, check_in, check_out, guest_name, guest_email, guest_phone, 
             guests_count, accommodation_amount, total_amount, source, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (booking_id, str(apartment_id), check_in, check_out, guest_name, guest_email, 
              guest_phone, guests_count, total_amount, total_amount, source, 'pending'))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        import requests
        
        try:
            notify_owner_url = 'https://functions.poehali.dev/d5dc60a9-f757-4cdf-bde4-995f24309d3f'
            notify_payload = {
                'booking_id': booking_id,
                'guest_name': guest_name,
                'guest_email': guest_email,
                'guest_phone': guest_phone,
                'apartment_id': apartment_id,
                'apartment_name': apartment_name,
                'check_in': check_in,
                'check_out': check_out,
                'total_amount': total_amount,
                'guest_login': guest_login,
                'guest_password': guest_password
            }
            
            requests.post(notify_owner_url, json=notify_payload, timeout=5)
        except Exception as e:
            print(f'Owner notification failed: {str(e)}')
        
        try:
            send_guest_confirmation_url = 'https://functions.poehali.dev/e349f36e-85b3-4c36-b488-07397019b5c0'
            guest_payload = {
                'guest_email': guest_email,
                'guest_name': guest_name,
                'booking_id': booking_id,
                'apartment_name': apartment_name,
                'check_in': check_in,
                'check_out': check_out,
                'total_amount': total_amount,
                'guest_phone': guest_phone
            }
            
            requests.post(send_guest_confirmation_url, json=guest_payload, timeout=5)
        except Exception as e:
            print(f'Guest confirmation failed: {str(e)}')
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'booking_id': booking_id,
                'message': 'Booking created successfully'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }