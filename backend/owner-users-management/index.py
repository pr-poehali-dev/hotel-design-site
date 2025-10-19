'''
Business: Manage owner/investor users (CRUD operations)
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with user data or status
'''
import json
import os
import hashlib
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute('''
                SELECT id, username, apartment_number, full_name, email, phone, is_active, created_at
                FROM t_p9202093_hotel_design_site.owner_users
                ORDER BY created_at DESC
            ''')
            users = cur.fetchall()
            
            result = []
            for user in users:
                result.append({
                    'id': user['id'],
                    'username': user['username'],
                    'apartment_number': user['apartment_number'] if user['apartment_number'] else '',
                    'full_name': user['full_name'],
                    'email': user['email'] if user['email'] else '',
                    'phone': user['phone'] if user['phone'] else '',
                    'is_active': user['is_active']
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data.get('username', '').strip()
            password = body_data.get('password', '').strip()
            full_name = body_data.get('full_name', '').strip()
            apartment_number = body_data.get('apartment_number', 'pending').strip()
            email = body_data.get('email', '').strip()
            phone = body_data.get('phone', '').strip()
            
            if not username or not password or not full_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username, password and full_name are required'})
                }
            
            cur.execute(
                'SELECT id FROM t_p9202093_hotel_design_site.owner_users WHERE username = %s',
                (username,)
            )
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username already exists'})
                }
            
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            cur.execute('''
                INSERT INTO t_p9202093_hotel_design_site.owner_users 
                (username, password_hash, full_name, apartment_number, email, phone, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, true, NOW(), NOW())
                RETURNING id
            ''', (username, password_hash, full_name, apartment_number, email, phone))
            
            new_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'User created successfully'})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('id')
            
            if user_id is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id is required'})
                }
            
            update_parts = []
            params = []
            
            if 'username' in body_data:
                update_parts.append('username = %s')
                params.append(body_data['username'])
            
            if 'password' in body_data and body_data['password']:
                update_parts.append('password_hash = %s')
                params.append(hashlib.sha256(body_data['password'].encode()).hexdigest())
            
            if 'full_name' in body_data:
                update_parts.append('full_name = %s')
                params.append(body_data['full_name'])
            
            if 'apartment_number' in body_data:
                update_parts.append('apartment_number = %s')
                params.append(body_data['apartment_number'])
            
            if 'email' in body_data:
                update_parts.append('email = %s')
                params.append(body_data['email'])
            
            if 'phone' in body_data:
                update_parts.append('phone = %s')
                params.append(body_data['phone'])
            
            if 'is_active' in body_data:
                update_parts.append('is_active = %s')
                params.append(body_data['is_active'])
            
            if not update_parts:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            update_parts.append('updated_at = NOW()')
            params.append(user_id)
            
            cur.execute(f'''
                UPDATE t_p9202093_hotel_design_site.owner_users 
                SET {', '.join(update_parts)}
                WHERE id = %s
            ''', params)
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'User updated successfully'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            user_id = params.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id parameter is required'})
                }
            
            cur.execute(
                'DELETE FROM t_p9202093_hotel_design_site.owner_users WHERE id = %s',
                (user_id,)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'User deleted successfully'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()