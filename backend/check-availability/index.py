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
            SELECT DISTINCT room_id
            FROM t_p9202093_hotel_design_site.availability_calendar
        ''')
        
        all_apartments = [str(row[0]) for row in cursor.fetchall()]
        
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=365)
        
        cursor.execute('''
            SELECT room_id, date, is_available, price
            FROM t_p9202093_hotel_design_site.availability_calendar
            WHERE date >= %s AND date < %s
            ORDER BY room_id, date
        ''', (start_date, end_date))
        
        calendar_data = cursor.fetchall()
        
        availability = {}
        
        for room_id, date, is_available, price in calendar_data:
            if str(room_id) not in availability:
                availability[str(room_id)] = {}
            
            availability[str(room_id)][date.isoformat()] = {
                'available': is_available,
                'price': float(price) if price else 8500
            }
        
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