import json
import os
import psycopg2
import psycopg2.extras
from typing import Dict, Any
from collections import defaultdict

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get calendar data from availability_calendar table grouped by apartment
    Args: event with httpMethod, queryStringParameters (start_date, end_date)
    Returns: HTTP response with calendar data grouped by room_id
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
    
    # Получаем параметры
    query_params = event.get('queryStringParameters', {}) or {}
    start_date = query_params.get('start_date')
    end_date = query_params.get('end_date')
    
    # Строим WHERE условие
    where_conditions = []
    if start_date:
        start_date_escaped = start_date.replace("'", "''")
        where_conditions.append(f"date >= '{start_date_escaped}'")
    if end_date:
        end_date_escaped = end_date.replace("'", "''")
        where_conditions.append(f"date <= '{end_date_escaped}'")
    
    where_clause = f"WHERE {' AND '.join(where_conditions)}" if where_conditions else ""
    
    # Получаем данные из календаря с информацией о бронированиях и названиями комнат
    cur.execute(f"""
        SELECT 
            ac.room_id,
            ac.date,
            ac.is_available,
            ac.booking_id,
            ac.price,
            b.guest_name,
            r.bnovo_name,
            r.number
        FROM t_p9202093_hotel_design_site.availability_calendar ac
        LEFT JOIN t_p9202093_hotel_design_site.bookings b ON ac.booking_id = b.id
        LEFT JOIN t_p9202093_hotel_design_site.rooms r ON ac.room_id = r.id
        {where_clause}
        ORDER BY ac.room_id, ac.date
    """)
    
    rows = cur.fetchall()
    
    # Группируем по room_id и сохраняем информацию о комнате
    calendars_dict = defaultdict(lambda: {'days': [], 'bnovo_name': None, 'number': None})
    
    for row in rows:
        room_id = row['room_id']
        calendars_dict[room_id]['days'].append({
            'date': str(row['date']),
            'is_available': row['is_available'],
            'price': float(row['price']) if row['price'] else 0,
            'booking_id': row['booking_id'],
            'guest_name': row['guest_name']
        })
        # Сохраняем название комнаты (одинаковое для всех дней)
        if row.get('bnovo_name'):
            calendars_dict[room_id]['bnovo_name'] = row['bnovo_name']
        if row.get('number'):
            calendars_dict[room_id]['number'] = row['number']
    
    # Преобразуем в список календарей
    calendars = []
    for room_id, data in calendars_dict.items():
        # Формируем название: ID (номер - название)
        if data['bnovo_name'] and data['number']:
            room_name = f"{room_id} ({data['number']} - {data['bnovo_name']})"
        elif data['number']:
            room_name = f"{room_id} ({data['number']})"
        elif data['bnovo_name']:
            room_name = f"{room_id} ({data['bnovo_name']})"
        else:
            room_name = f"Апартамент {room_id}"
        
        calendars.append({
            'room_id': room_id,
            'room_name': room_name,
            'days': data['days']
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'calendars': calendars,
            'total_rooms': len(calendars)
        }, ensure_ascii=False)
    }