'''
Business: Guest bookings API - get all bookings for authenticated guest
Args: event with httpMethod (GET), headers with X-User-Email
Returns: HTTP response with list of bookings or error
'''

import json
import os
from typing import Dict, Any, List
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Get database connection"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        headers = event.get('headers', {})
        user_email = headers.get('X-User-Email', '').lower().strip()
        
        if not user_email:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Требуется авторизация'})
            }
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            """
            SELECT 
                id,
                apartment_id,
                check_in,
                check_out,
                guest_name,
                guest_email,
                guest_phone,
                total_amount,
                early_check_in,
                late_check_out,
                parking,
                show_to_guest,
                created_at
            FROM t_p9202093_hotel_design_site.bookings 
            WHERE LOWER(guest_email) = %s
            ORDER BY check_in DESC
            """,
            (user_email,)
        )
        
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()
        
        bookings_list = []
        for booking in bookings:
            booking_dict = dict(booking)
            
            if booking_dict.get('check_in'):
                booking_dict['check_in'] = booking_dict['check_in'].isoformat()
            if booking_dict.get('check_out'):
                booking_dict['check_out'] = booking_dict['check_out'].isoformat()
            if booking_dict.get('created_at'):
                booking_dict['created_at'] = booking_dict['created_at'].isoformat()
            
            for key in ['total_amount', 'early_check_in', 'late_check_out', 'parking']:
                if booking_dict.get(key) is not None:
                    booking_dict[key] = float(booking_dict[key])
            
            bookings_list.append(booking_dict)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'bookings': bookings_list,
                'total': len(bookings_list)
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
