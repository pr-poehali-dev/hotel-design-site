'''
Business: Обновление данных горничной (имя, email)
Args: event с httpMethod, body (id, name, email)
Returns: HTTP response с обновленной горничной
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'PUT':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    housekeeper_id = body_data.get('id')
    name = body_data.get('name')
    email = body_data.get('email')
    
    if not housekeeper_id or not name:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'ID and name are required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    # Обновляем горничную
    if email:
        cursor.execute(
            "UPDATE housekeepers SET name = %s, email = %s WHERE id = %s RETURNING id, name, email, created_at",
            (name, email, housekeeper_id)
        )
    else:
        cursor.execute(
            "UPDATE housekeepers SET name = %s WHERE id = %s RETURNING id, name, email, created_at",
            (name, housekeeper_id)
        )
    
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    
    if not result:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Housekeeper not found'})
        }
    
    housekeeper = {
        'id': result[0],
        'name': result[1],
        'email': result[2],
        'created_at': result[3].isoformat() if result[3] else None
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(housekeeper)
    }
