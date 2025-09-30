import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage report users (list, create, update, delete)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with user management result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    admin_token = headers.get('X-Admin-Token') or headers.get('x-admin-token')
    
    if not admin_token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Admin authentication required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    admin_check = '''
        SELECT role FROM report_users 
        WHERE id = %s AND role = 'admin' AND is_active = TRUE
    '''
    
    try:
        user_id = int(admin_token)
    except ValueError:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid admin token'})
        }
    
    cur.execute(admin_check, (user_id,))
    admin_role = cur.fetchone()
    
    if not admin_role:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Access denied - admin only'})
        }
    
    if method == 'GET':
        cur.execute('''
            SELECT id, username, full_name, role, is_active, apartment_numbers, created_at
            FROM report_users
            ORDER BY id
        ''')
        
        users = []
        for row in cur.fetchall():
            users.append({
                'id': row[0],
                'username': row[1],
                'full_name': row[2],
                'role': row[3],
                'is_active': row[4],
                'apartment_numbers': row[5] if row[5] else [],
                'created_at': row[6].isoformat() if row[6] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'users': users})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        username = body_data.get('username')
        password = body_data.get('password')
        full_name = body_data.get('full_name')
        role = body_data.get('role', 'viewer')
        apartment_numbers = body_data.get('apartment_numbers', [])
        
        if not username or not password or not full_name:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Username, password and full_name required'})
            }
        
        cur.execute('''
            INSERT INTO report_users (username, password, full_name, role, apartment_numbers)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, username, full_name, role, is_active, apartment_numbers
        ''', (username, password, full_name, role, apartment_numbers))
        
        new_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'user': {
                    'id': new_user[0],
                    'username': new_user[1],
                    'full_name': new_user[2],
                    'role': new_user[3],
                    'is_active': new_user[4],
                    'apartment_numbers': new_user[5] if new_user[5] else []
                }
            })
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        user_id_to_update = body_data.get('id')
        password = body_data.get('password')
        full_name = body_data.get('full_name')
        role = body_data.get('role')
        is_active = body_data.get('is_active')
        apartment_numbers = body_data.get('apartment_numbers')
        
        if not user_id_to_update:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User ID required'})
            }
        
        updates = []
        params = []
        
        if password:
            updates.append('password = %s')
            params.append(password)
        if full_name:
            updates.append('full_name = %s')
            params.append(full_name)
        if role:
            updates.append('role = %s')
            params.append(role)
        if is_active is not None:
            updates.append('is_active = %s')
            params.append(is_active)
        if apartment_numbers is not None:
            updates.append('apartment_numbers = %s')
            params.append(apartment_numbers)
        
        if not updates:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No fields to update'})
            }
        
        params.append(user_id_to_update)
        query = f'''
            UPDATE report_users 
            SET {', '.join(updates)}
            WHERE id = %s
            RETURNING id, username, full_name, role, is_active, apartment_numbers
        '''
        
        cur.execute(query, params)
        updated_user = cur.fetchone()
        
        if not updated_user:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User not found'})
            }
        
        conn.commit()
        cur.close()
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
                'user': {
                    'id': updated_user[0],
                    'username': updated_user[1],
                    'full_name': updated_user[2],
                    'role': updated_user[3],
                    'is_active': updated_user[4],
                    'apartment_numbers': updated_user[5] if updated_user[5] else []
                }
            })
        }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        user_id_to_delete = params.get('id')
        
        if not user_id_to_delete:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User ID required'})
            }
        
        cur.execute('DELETE FROM report_users WHERE id = %s RETURNING id', (user_id_to_delete,))
        deleted_user = cur.fetchone()
        
        if not deleted_user:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'User not found'})
            }
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'User deleted'})
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }