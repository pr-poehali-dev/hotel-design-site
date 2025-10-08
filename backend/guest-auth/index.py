'''
Business: Guest authentication API - manage guests (list, register, login, reset password, delete)
Args: event with httpMethod (GET/POST/DELETE), body with action (register/login/reset_password), email, password, name, phone, new_password
Returns: HTTP response with user data/list and token or error
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    """Generate secure random token"""
    return secrets.token_urlsafe(32)

def get_db_connection():
    """Get database connection"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        try:
            conn = get_db_connection()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            cursor.execute(
                """
                SELECT id, email, name, phone, created_at 
                FROM t_p9202093_hotel_design_site.guest_users 
                ORDER BY created_at DESC
                """
            )
            guests = cursor.fetchall()
            
            guests_list = []
            for guest in guests:
                # Get bookings for this guest
                cursor.execute(
                    f"""
                    SELECT id, apartment_id, check_in, check_out, accommodation_amount, total_amount
                    FROM t_p9202093_hotel_design_site.bookings 
                    WHERE guest_user_id = {guest['id']} AND show_to_guest = true
                    ORDER BY check_in DESC
                    """
                )
                bookings = cursor.fetchall()
                
                bookings_list = []
                for booking in bookings:
                    bookings_list.append({
                        'id': booking['id'],
                        'apartment_id': booking['apartment_id'],
                        'check_in': booking['check_in'].isoformat() if booking['check_in'] else None,
                        'check_out': booking['check_out'].isoformat() if booking['check_out'] else None,
                        'accommodation_amount': float(booking['accommodation_amount']) if booking['accommodation_amount'] else 0,
                        'total_amount': float(booking['total_amount']) if booking['total_amount'] else 0
                    })
                
                guests_list.append({
                    'id': guest['id'],
                    'email': guest['email'],
                    'name': guest['name'],
                    'phone': guest['phone'],
                    'created_at': guest['created_at'].isoformat() if guest['created_at'] else None,
                    'bookings': bookings_list
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'guests': guests_list
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'DELETE':
        try:
            query_params = event.get('queryStringParameters', {}) or {}
            guest_id = query_params.get('id')
            booking_id = query_params.get('booking_id')
            action = query_params.get('action')
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            if action == 'delete_booking' and booking_id:
                booking_id_safe = booking_id.replace("'", "''")
                cursor.execute(
                    f"DELETE FROM t_p9202093_hotel_design_site.bookings WHERE id = '{booking_id_safe}'"
                )
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Бронирование удалено'
                    })
                }
            
            if not guest_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID гостя обязателен'})
                }
            
            cursor.execute(
                f"DELETE FROM t_p9202093_hotel_design_site.guest_users WHERE id = {guest_id}"
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Гость удалён'
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'PUT':
        try:
            body_data = json.loads(event.get('body', '{}'))
            booking_id = body_data.get('booking_id', '').replace("'", "''")
            apartment_id = body_data.get('apartment_id', '').replace("'", "''")
            check_in = body_data.get('check_in', '')
            check_out = body_data.get('check_out', '')
            price_per_night = body_data.get('price_per_night', 0)
            total_amount = body_data.get('total_amount', 0)
            
            if not booking_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID бронирования обязателен'})
                }
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute(
                f"""
                UPDATE t_p9202093_hotel_design_site.bookings 
                SET apartment_id = '{apartment_id}',
                    check_in = '{check_in}',
                    check_out = '{check_out}',
                    accommodation_amount = {price_per_night},
                    total_amount = {total_amount},
                    updated_at = NOW()
                WHERE id = '{booking_id}'
                """
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Бронирование обновлено'
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        path = event.get('path', '')
        
        if '/create-booking' in path or event.get('queryStringParameters', {}).get('action') == 'create_booking':
            try:
                body_data = json.loads(event.get('body', '{}'))
                guest_id = body_data.get('guest_id', 0)
                apartment_id = body_data.get('apartment_id', '').replace("'", "''")
                check_in = body_data.get('check_in', '')
                check_out = body_data.get('check_out', '')
                price_per_night = body_data.get('price_per_night', 0)
                total_amount = body_data.get('total_amount', 0)
                
                if not guest_id or not apartment_id or not check_in or not check_out:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Все обязательные поля должны быть заполнены'})
                    }
                
                conn = get_db_connection()
                cursor = conn.cursor(cursor_factory=RealDictCursor)
                
                cursor.execute(
                    f"SELECT name, email, phone FROM t_p9202093_hotel_design_site.guest_users WHERE id = {guest_id}"
                )
                guest = cursor.fetchone()
                
                if not guest:
                    cursor.close()
                    conn.close()
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Гость не найден'})
                    }
                
                booking_id = str(int(datetime.now().timestamp() * 1000))
                guest_name = guest['name'].replace("'", "''")
                guest_email = guest['email'].replace("'", "''")
                guest_phone = guest['phone'].replace("'", "''")
                
                cursor.execute(
                    f"""
                    INSERT INTO t_p9202093_hotel_design_site.bookings 
                    (id, apartment_id, check_in, check_out, accommodation_amount, total_amount, 
                     guest_name, guest_email, guest_phone, guest_user_id, show_to_guest, created_at)
                    VALUES ('{booking_id}', '{apartment_id}', '{check_in}', '{check_out}', 
                            {price_per_night}, {total_amount}, '{guest_name}', '{guest_email}', '{guest_phone}', {guest_id}, true, NOW())
                    """
                )
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'booking_id': booking_id,
                        'message': 'Бронирование создано'
                    })
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': str(e)})
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
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        email = body_data.get('email', '').lower().strip()
        password = body_data.get('password', '')
        
        if not email or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email и пароль обязательны'})
            }
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            name = body_data.get('name', '').replace("'", "''")
            phone = body_data.get('phone', '').replace("'", "''")
            email_safe = email.replace("'", "''")
            apartment_id = body_data.get('apartment_id', '').replace("'", "''")
            check_in = body_data.get('check_in', '')
            check_out = body_data.get('check_out', '')
            price_per_night = body_data.get('price_per_night', 0)
            total_amount = body_data.get('total_amount', 0)
            
            # Check if user exists
            cursor.execute(
                f"SELECT id FROM t_p9202093_hotel_design_site.guest_users WHERE email = '{email_safe}'"
            )
            existing = cursor.fetchone()
            
            if existing:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Пользователь с таким email уже существует'})
                }
            
            # Create new user
            password_hash = hash_password(password)
            cursor.execute(
                f"""
                INSERT INTO t_p9202093_hotel_design_site.guest_users 
                (email, password_hash, name, phone) 
                VALUES ('{email_safe}', '{password_hash}', '{name}', '{phone}') 
                RETURNING id, email, name, phone, created_at
                """
            )
            user = cursor.fetchone()
            user_id = user['id']
            
            # Create booking if booking info provided
            if apartment_id and check_in and check_out:
                booking_id = str(int(datetime.now().timestamp() * 1000))
                cursor.execute(
                    f"""
                    INSERT INTO t_p9202093_hotel_design_site.bookings 
                    (id, apartment_id, check_in, check_out, accommodation_amount, total_amount, 
                     guest_name, guest_email, guest_phone, guest_user_id, show_to_guest, created_at)
                    VALUES ('{booking_id}', '{apartment_id}', '{check_in}', '{check_out}', 
                            {price_per_night}, {total_amount}, '{name}', '{email_safe}', '{phone}', {user_id}, true, NOW())
                    """
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            token = generate_token()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                        'phone': user['phone']
                    },
                    'token': token
                })
            }
        
        elif action == 'login':
            password_hash = hash_password(password)
            email_safe = email.replace("'", "''")
            
            cursor.execute(
                f"""
                SELECT id, email, name, phone, created_at 
                FROM t_p9202093_hotel_design_site.guest_users 
                WHERE email = '{email_safe}' AND password_hash = '{password_hash}'
                """
            )
            user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            token = generate_token()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                        'phone': user['phone']
                    },
                    'token': token
                })
            }
        
        elif action == 'reset_password':
            new_password = body_data.get('new_password', '')
            
            if not new_password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Новый пароль обязателен'})
                }
            
            email_safe = email.replace("'", "''")
            
            # Check if user exists
            cursor.execute(
                f"SELECT id FROM t_p9202093_hotel_design_site.guest_users WHERE email = '{email_safe}'"
            )
            user = cursor.fetchone()
            
            if not user:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Пользователь не найден'})
                }
            
            # Update password
            password_hash = hash_password(new_password)
            cursor.execute(
                f"""
                UPDATE t_p9202093_hotel_design_site.guest_users 
                SET password_hash = '{password_hash}' 
                WHERE email = '{email_safe}'
                """
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Пароль успешно изменён'
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неизвестное действие'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }