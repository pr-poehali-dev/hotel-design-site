import json
import os
import psycopg2
import psycopg2.extras
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get calendar data from calendar_bnovo table (Bnovo bookings calendar)
    Args: event with httpMethod, queryStringParameters (month, year, apartment_id)
    Returns: HTTP response with calendar data grouped by apartment and date
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
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    # Получаем параметры фильтрации
    query_params = event.get('queryStringParameters', {}) or {}
    month = query_params.get('month')
    year = query_params.get('year')
    apartment_id = query_params.get('apartment_id')
    
    # Строим WHERE условие
    where_conditions = []
    
    if month and year:
        where_conditions.append(f"EXTRACT(MONTH FROM date) = {month} AND EXTRACT(YEAR FROM date) = {year}")
    
    if apartment_id and apartment_id != 'all':
        apartment_id_escaped = apartment_id.replace("'", "''")
        where_conditions.append(f"apartment_id = '{apartment_id_escaped}'")
    
    where_clause = f"WHERE {' AND '.join(where_conditions)}" if where_conditions else ""
    
    # Получаем данные из календаря
    cur.execute(f"""
        SELECT 
            apartment_id,
            date,
            is_available,
            booking_id,
            bnovo_id,
            guest_name,
            price
        FROM t_p9202093_hotel_design_site.calendar_bnovo
        {where_clause}
        ORDER BY apartment_id, date
    """)
    
    rows = cur.fetchall()
    calendar_data = []
    
    for row in rows:
        calendar_data.append({
            'apartment_id': row['apartment_id'],
            'date': str(row['date']),
            'is_available': row['is_available'],
            'booking_id': row['booking_id'],
            'bnovo_id': row['bnovo_id'],
            'guest_name': row['guest_name'],
            'price': float(row['price']) if row['price'] else 0
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'calendar': calendar_data,
            'total': len(calendar_data)
        })
    }
