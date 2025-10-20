import json
import os
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение календаря доступности апартамента
    Args: event - dict с httpMethod, queryStringParameters (room_id, month, year)
          context - объект с атрибутами request_id
    Returns: HTTP response с календарём доступности
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
    
    try:
        import psycopg2
        import psycopg2.extras
        
        params = event.get('queryStringParameters', {}) or {}
        room_id = params.get('room_id', '')
        month = int(params.get('month', datetime.now().month))
        year = int(params.get('year', datetime.now().year))
        
        if not room_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'room_id is required'})
            }
        
        database_url = os.environ.get('DATABASE_URL', '')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        # Подключаемся к базе данных
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Получаем информацию об апартаменте
        cur.execute("""
            SELECT id, number, floor, bnovo_name, description, 
                   price_per_night, max_guests, bedrooms, bathrooms, 
                   area, images, amenities, address
            FROM t_p9202093_hotel_design_site.rooms
            WHERE id = %s
        """, (room_id,))
        
        apartment = cur.fetchone()
        
        if not apartment:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Apartment not found'})
            }
        
        # Рассчитываем диапазон дат для месяца
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date()
        else:
            end_date = datetime(year, month + 1, 1).date()
        
        # Получаем календарь доступности
        cur.execute("""
            SELECT date, is_available, price, booking_id
            FROM t_p9202093_hotel_design_site.availability_calendar
            WHERE room_id = %s 
              AND date >= %s 
              AND date < %s
            ORDER BY date
        """, (room_id, start_date, end_date))
        
        calendar_data = cur.fetchall()
        
        # Формируем календарь для всех дней месяца
        calendar = []
        current_date = start_date
        calendar_dict = {row['date']: row for row in calendar_data}
        
        while current_date < end_date:
            if current_date in calendar_dict:
                day_data = calendar_dict[current_date]
                calendar.append({
                    'date': current_date.isoformat(),
                    'available': day_data['is_available'],
                    'price': float(day_data['price']) if day_data['price'] else float(apartment['price_per_night'] or 0),
                    'booked': day_data['booking_id'] is not None
                })
            else:
                # День не в календаре - считаем доступным
                calendar.append({
                    'date': current_date.isoformat(),
                    'available': True,
                    'price': float(apartment['price_per_night'] or 0),
                    'booked': False
                })
            
            current_date += timedelta(days=1)
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'apartment': {
                    'id': apartment['id'],
                    'name': apartment['bnovo_name'] or apartment['number'],
                    'description': apartment['description'],
                    'price_per_night': float(apartment['price_per_night'] or 0),
                    'max_guests': apartment['max_guests'],
                    'bedrooms': apartment['bedrooms'],
                    'bathrooms': apartment['bathrooms'],
                    'area': float(apartment['area']) if apartment['area'] else None,
                    'images': apartment['images'] or [],
                    'amenities': apartment['amenities'] or [],
                    'address': apartment['address']
                },
                'calendar': calendar,
                'month': month,
                'year': year
            }, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            })
        }
