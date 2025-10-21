import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get list of all apartments/rooms for booking
    Args: event with httpMethod
    Returns: HTTP response with list of apartments
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
            SELECT id, number, bnovo_name, price_per_night, max_guests, bedrooms, bathrooms
            FROM t_p9202093_hotel_design_site.rooms
            ORDER BY number
        ''')
        
        rows = cursor.fetchall()
        apartments = []
        
        for row in rows:
            room_id, number, bnovo_name, price, max_guests, bedrooms, bathrooms = row
            apartments.append({
                'id': room_id,
                'name': bnovo_name if bnovo_name else number,
                'number': number,
                'price': int(float(price)) if price else 0,
                'max_guests': max_guests or 2,
                'bedrooms': bedrooms or 1,
                'bathrooms': bathrooms or 1
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'apartments': apartments,
                'total': len(apartments)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }