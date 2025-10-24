"""
Business: Авторизация гостей по логину и паролю
Args: event с httpMethod, body (login, password)
Returns: JSON с результатом авторизации и данными гостя
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к БД через simple query protocol"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'success': False, 'message': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    login = body_data.get('login', '').strip().replace("'", "''")
    password = body_data.get('password', '').strip().replace("'", "''")
    
    if not login or not password:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'success': False, 'message': 'Логин и пароль обязательны'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = f"SELECT * FROM guests WHERE login = '{login}' AND password = '{password}' LIMIT 1"
        cursor.execute(query)
        guest = cursor.fetchone()
        
        if not guest:
            return {
                'statusCode': 401,
                'headers': headers,
                'body': json.dumps({'success': False, 'message': 'Неверный логин или пароль'}),
                'isBase64Encoded': False
            }
        
        guest_dict = {}
        for key, value in guest.items():
            if hasattr(value, 'isoformat'):
                guest_dict[key] = value.isoformat()
            elif str(type(value)) == "<class 'decimal.Decimal'>":
                guest_dict[key] = float(value)
            else:
                guest_dict[key] = value
        
        guest_dict.pop('password', None)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True, 
                'message': 'Успешный вход',
                'guest': guest_dict
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'success': False, 'message': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
