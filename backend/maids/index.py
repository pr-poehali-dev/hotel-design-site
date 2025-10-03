import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления горничными - получение списка, добавление, редактирование
    Args: event - dict with httpMethod, body, queryStringParameters, pathParams
          context - object with request_id attribute
    Returns: HTTP response dict with list of maids or operation result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            path_params = event.get('pathParams', {})
            maid_id = path_params.get('id')
            
            if maid_id:
                cur.execute('''
                    SELECT id, name, phone, rate_per_cleaning, is_active, created_at
                    FROM maids WHERE id = %s
                ''', (maid_id,))
                row = cur.fetchone()
                if row:
                    maid = {
                        'id': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'rate_per_cleaning': float(row[3]),
                        'is_active': row[4],
                        'created_at': row[5].isoformat() if row[5] else None
                    }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(maid)
                    }
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Maid not found'})
                }
            
            cur.execute('''
                SELECT id, name, phone, rate_per_cleaning, is_active, created_at
                FROM maids ORDER BY name
            ''')
            maids = []
            for row in cur.fetchall():
                maids.append({
                    'id': row[0],
                    'name': row[1],
                    'phone': row[2],
                    'rate_per_cleaning': float(row[3]),
                    'is_active': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(maids)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            phone = body_data.get('phone', '')
            rate = body_data.get('rate_per_cleaning', 0)
            
            cur.execute('''
                INSERT INTO maids (name, phone, rate_per_cleaning, is_active)
                VALUES (%s, %s, %s, true) RETURNING id
            ''', (name, phone, rate))
            
            maid_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': maid_id, 'message': 'Maid created successfully'})
            }
        
        if method == 'PUT':
            path_params = event.get('pathParams', {})
            maid_id = path_params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name')
            phone = body_data.get('phone', '')
            rate = body_data.get('rate_per_cleaning', 0)
            is_active = body_data.get('is_active', True)
            
            cur.execute('''
                UPDATE maids
                SET name = %s, phone = %s, rate_per_cleaning = %s, is_active = %s
                WHERE id = %s
            ''', (name, phone, rate, is_active, maid_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Maid updated successfully'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
