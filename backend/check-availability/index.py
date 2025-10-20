import json
import os
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Check apartment availability based on bookings
    Args: event with httpMethod
    Returns: HTTP response with availability calendar for all apartments
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
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
            SELECT apartment_id, check_in, check_out
            FROM t_p9202093_hotel_design_site.bookings
            WHERE status != 'cancelled'
            AND check_out >= CURRENT_DATE
            ORDER BY apartment_id, check_in
        ''')
        
        bookings = cursor.fetchall()
        
        availability = {}
        
        for apartment_id, check_in, check_out in bookings:
            if str(apartment_id) not in availability:
                availability[str(apartment_id)] = {}
            
            current_date = check_in
            while current_date < check_out:
                date_str = current_date.isoformat()
                availability[str(apartment_id)][date_str] = {
                    'available': False,
                    'price': 8500
                }
                current_date += timedelta(days=1)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'availability': availability
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
