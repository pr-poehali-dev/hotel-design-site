'''
Business: Guest authentication API - register and login with email/password
Args: event with httpMethod (POST), body with action, email, password, name, phone
Returns: HTTP response with user data and token or error
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            name = body_data.get('name', '')
            phone = body_data.get('phone', '')
            
            # Check if user exists
            cursor.execute(
                "SELECT id FROM t_p9202093_hotel_design_site.guest_users WHERE email = %s",
                (email,)
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
                """
                INSERT INTO t_p9202093_hotel_design_site.guest_users 
                (email, password_hash, name, phone) 
                VALUES (%s, %s, %s, %s) 
                RETURNING id, email, name, phone, created_at
                """,
                (email, password_hash, name, phone)
            )
            user = cursor.fetchone()
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
            
            cursor.execute(
                """
                SELECT id, email, name, phone, created_at 
                FROM t_p9202093_hotel_design_site.guest_users 
                WHERE email = %s AND password_hash = %s
                """,
                (email, password_hash)
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
