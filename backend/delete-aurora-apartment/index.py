'''
Business: Удаление апартамента Aurora и всех связанных данных
Args: event - dict with httpMethod
      context - object with attributes: request_id, function_name
Returns: HTTP response dict
'''
import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Подключаемся к БД
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    apartment_id = '1759775560156'
    room_number = '2019'
    
    # Удаляем данные из календаря доступности
    cursor.execute(
        f"DELETE FROM t_p9202093_hotel_design_site.availability_calendar WHERE room_id = '{apartment_id}'"
    )
    calendar_deleted = cursor.rowcount
    
    # Удаляем историю уборок
    cursor.execute(
        f"DELETE FROM t_p9202093_hotel_design_site.cleaning_history WHERE room_number = '{room_number}'"
    )
    cleaning_deleted = cursor.rowcount
    
    # Удаляем сам апартамент
    cursor.execute(
        f"DELETE FROM t_p9202093_hotel_design_site.rooms WHERE id = '{apartment_id}'"
    )
    apartment_deleted = cursor.rowcount
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'deleted': {
                'apartment': apartment_deleted,
                'calendar_records': calendar_deleted,
                'cleaning_history': cleaning_deleted
            }
        })
    }