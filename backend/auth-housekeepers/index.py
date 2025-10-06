import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Авторизация пользователей (горничные + админы) через БД
    Args: event - dict with httpMethod, body
          context - object with request_id attribute
    Returns: HTTP response с данными пользователя или ошибкой
    '''
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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    username = body_data.get('username', '').strip()
    password = body_data.get('password', '').strip()
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Username and password required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()
    
    try:
        # Экранирование для безопасности
        safe_username = username.replace("'", "''")
        safe_password = password.replace("'", "''")
        
        # Поиск пользователя по email (нечувствительно к регистру)
        query = f"""
            SELECT id, name, email, role
            FROM housekeepers
            WHERE LOWER(email) = LOWER('{safe_username}') AND password = '{safe_password}'
        """
        cur.execute(query)
        
        row = cur.fetchone()
        
        if not row:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'})
            }
        
        user = {
            'id': row[0],
            'username': row[1],  # Используем имя, а не email
            'email': row[2],
            'role': row[3]
        }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(user)
        }
    
    finally:
        cur.close()
        conn.close()