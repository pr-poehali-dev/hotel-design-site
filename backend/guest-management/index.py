'''
Business: Управление гостями для админа (CRUD операции)
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict
'''
import json
import os
import hashlib
from typing import Dict, Any, List, Optional
import psycopg2
import psycopg2.extras

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
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
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        # GET - получить всех гостей или одного по ID
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            guest_id = params.get('id')
            
            if guest_id:
                # Получить одного гостя с его бронями
                cursor.execute(f"""
                    SELECT id, username, email, name, phone, status, guest_type, 
                           assigned_apartments, admin_notes, promo_codes, is_vip,
                           total_bookings, total_spent, created_at, updated_at
                    FROM t_p9202093_hotel_design_site.guest_users
                    WHERE id = {int(guest_id)}
                """)
                guest = cursor.fetchone()
                
                if not guest:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Guest not found'})
                    }
                
                # Получить брони гостя
                cursor.execute(f"""
                    SELECT b.id, b.apartment_id, b.check_in, b.check_out, 
                           b.total_amount, b.status, b.guest_name, b.created_at,
                           r.bnovo_name as apartment_name, r.number as room_number
                    FROM t_p9202093_hotel_design_site.bookings b
                    LEFT JOIN t_p9202093_hotel_design_site.rooms r ON b.apartment_id = r.id
                    WHERE b.guest_user_id = {int(guest_id)}
                    ORDER BY b.check_in DESC
                """)
                bookings = cursor.fetchall()
                
                guest_dict = dict(guest)
                guest_dict['bookings'] = [dict(b) for b in bookings]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(guest_dict, default=str)
                }
            else:
                # Получить всех гостей
                search = params.get('search', '')
                guest_type_filter = params.get('type')
                
                where_conditions = []
                if search:
                    search_escaped = search.replace("'", "''")
                    where_conditions.append(f"(name ILIKE '%{search_escaped}%' OR email ILIKE '%{search_escaped}%' OR phone ILIKE '%{search_escaped}%' OR username ILIKE '%{search_escaped}%')")
                if guest_type_filter:
                    type_escaped = guest_type_filter.replace("'", "''")
                    where_conditions.append(f"guest_type = '{type_escaped}'")
                
                where_clause = f"WHERE {' AND '.join(where_conditions)}" if where_conditions else ""
                
                cursor.execute(f"""
                    SELECT id, username, email, name, phone, status, guest_type, 
                           is_vip, total_bookings, total_spent, created_at
                    FROM t_p9202093_hotel_design_site.guest_users
                    {where_clause}
                    ORDER BY created_at DESC
                """)
                guests = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'guests': [dict(g) for g in guests]}, default=str)
                }
        
        # POST - создать нового гостя
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            username = body.get('username')
            password = body.get('password')
            email = body.get('email')
            name = body.get('name')
            phone = body.get('phone', '')
            guest_type = body.get('guest_type', 'regular')
            assigned_apartments = json.dumps(body.get('assigned_apartments', []))
            admin_notes = body.get('admin_notes', '')
            is_vip = body.get('is_vip', False)
            
            if not username or not password or not email or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Username, password, email and name are required'})
                }
            
            password_hash = hash_password(password)
            
            username_escaped = username.replace("'", "''")
            email_escaped = email.replace("'", "''")
            name_escaped = name.replace("'", "''")
            phone_escaped = phone.replace("'", "''")
            guest_type_escaped = guest_type.replace("'", "''")
            admin_notes_escaped = admin_notes.replace("'", "''")
            
            cursor.execute(f"""
                INSERT INTO t_p9202093_hotel_design_site.guest_users 
                (username, email, password_hash, name, phone, guest_type, assigned_apartments, admin_notes, is_vip)
                VALUES ('{username_escaped}', '{email_escaped}', '{password_hash}', '{name_escaped}', 
                        '{phone_escaped}', '{guest_type_escaped}', '{assigned_apartments}', 
                        '{admin_notes_escaped}', {is_vip})
                RETURNING id, username, email, name, phone, status, guest_type, is_vip
            """)
            new_guest = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'guest': dict(new_guest),
                    'plain_password': password
                }, default=str)
            }
        
        # PUT - обновить гостя
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            guest_id = body.get('id')
            
            if not guest_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Guest ID is required'})
                }
            
            updates = []
            if 'username' in body:
                username_escaped = body['username'].replace("'", "''")
                updates.append(f"username = '{username_escaped}'")
            if 'email' in body:
                email_escaped = body['email'].replace("'", "''")
                updates.append(f"email = '{email_escaped}'")
            if 'name' in body:
                name_escaped = body['name'].replace("'", "''")
                updates.append(f"name = '{name_escaped}'")
            if 'phone' in body:
                phone_escaped = body['phone'].replace("'", "''")
                updates.append(f"phone = '{phone_escaped}'")
            if 'password' in body and body['password']:
                password_hash = hash_password(body['password'])
                updates.append(f"password_hash = '{password_hash}'")
            if 'guest_type' in body:
                guest_type_escaped = body['guest_type'].replace("'", "''")
                updates.append(f"guest_type = '{guest_type_escaped}'")
            if 'status' in body:
                status_escaped = body['status'].replace("'", "''")
                updates.append(f"status = '{status_escaped}'")
            if 'assigned_apartments' in body:
                assigned_json = json.dumps(body['assigned_apartments'])
                updates.append(f"assigned_apartments = '{assigned_json}'")
            if 'admin_notes' in body:
                notes_escaped = body['admin_notes'].replace("'", "''")
                updates.append(f"admin_notes = '{notes_escaped}'")
            if 'is_vip' in body:
                updates.append(f"is_vip = {body['is_vip']}")
            
            updates.append("updated_at = CURRENT_TIMESTAMP")
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            cursor.execute(f"""
                UPDATE t_p9202093_hotel_design_site.guest_users
                SET {', '.join(updates)}
                WHERE id = {int(guest_id)}
                RETURNING id, username, email, name, phone, status, guest_type, is_vip, updated_at
            """)
            updated_guest = cursor.fetchone()
            conn.commit()
            
            if not updated_guest:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Guest not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'guest': dict(updated_guest)}, default=str)
            }
        
        # DELETE - удалить гостя
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            guest_id = params.get('id')
            
            if not guest_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Guest ID is required'})
                }
            
            cursor.execute(f"""
                DELETE FROM t_p9202093_hotel_design_site.guest_users
                WHERE id = {int(guest_id)}
                RETURNING id
            """)
            deleted = cursor.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Guest not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Guest deleted'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cursor.close()
        conn.close()
