import json
import os
import psycopg2
import time
from datetime import datetime
from typing import Dict, Any

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
        
        guests_count = adults + children
        total_amount = 0
        booking_id = str(int(time.time() * 1000))
        
        cursor.execute('''
            INSERT INTO bookings (
                id, apartment_id, check_in, check_out, 
                guest_name, guest_email, guest_phone,
                guests_count, status, source, 
                accommodation_amount, total_amount,
                created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id
        ''', (
            booking_id, str(apartment_id), check_in, check_out,
            guest_name, guest_email, guest_phone,
            guests_count, 'confirmed', source,
            total_amount, total_amount
        ))
        
        booking_id = cursor.fetchone()[0]
        conn.commit()
        
        cursor.close()
        conn.close()
        
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