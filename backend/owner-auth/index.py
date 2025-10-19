import json
import os
import hashlib
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Аутентификация и регистрация собственников квартир
    Args: event - httpMethod (POST/OPTIONS), body с action (login/register), email, password
    Returns: HTTP response с токеном и данными собственника
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Owner-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    body = event.get('body', '{}')
    print(f"DEBUG: Raw body type={type(body)}, value={repr(body)}")
    
    if not body or body == '':
        body = '{}'
    
    try:
        body_data = json.loads(body)
        print(f"DEBUG: Parsed body_data={body_data}")
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSONDecodeError - {str(e)}, body={repr(body)}")
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Invalid JSON in request body'})
        }
    
    action = body_data.get('action', 'login')
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url, options="-c search_path=t_p9202093_hotel_design_site")
    
    try:
        if action == 'register':
            return handle_register(conn, body_data)
        else:
            return handle_login(conn, body_data)
    finally:
        conn.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handle_register(conn, data: Dict[str, Any]) -> Dict[str, Any]:
    name = data.get('name', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    password = data.get('password', '')
    
    if not all([name, email, password]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Заполните все обязательные поля'})
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    safe_email = email.replace("'", "''")
    sql = f"SELECT id FROM t_p9202093_hotel_design_site.owner_users WHERE email = '{safe_email}'"
    cursor.execute(sql)
    existing = cursor.fetchone()
    
    if existing:
        cursor.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Пользователь с таким email уже существует'})
        }
    
    password_hash = hash_password(password)
    safe_name = name.replace("'", "''")
    safe_email = email.replace("'", "''")
    safe_phone = phone.replace("'", "''")
    
    sql = f"""INSERT INTO t_p9202093_hotel_design_site.owner_users 
       (username, full_name, email, phone, password_hash, apartment_number, is_active, created_at, updated_at) 
       VALUES ('{safe_email}', '{safe_name}', '{safe_email}', '{safe_phone}', '{password_hash}', 'pending', true, NOW(), NOW()) 
       RETURNING id"""
    cursor.execute(sql)
    result = cursor.fetchone()
    owner_id = result['id']
    
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'success': True, 'message': 'Регистрация прошла успешно', 'ownerId': str(owner_id)})
    }

def handle_login(conn, data: Dict[str, Any]) -> Dict[str, Any]:
    email = data.get('email', '')
    password = data.get('password', '')
    
    if not all([email, password]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Введите логин/email и пароль'})
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    password_hash = hash_password(password)
    safe_email = email.replace("'", "''")
    
    print(f"DEBUG: Looking for user with email={safe_email}, password_hash={password_hash}")
    
    sql = f"""SELECT id, full_name as name, email, apartment_number FROM t_p9202093_hotel_design_site.owner_users 
       WHERE (email = '{safe_email}' OR username = '{safe_email}') 
       AND password_hash = '{password_hash}' AND is_active = true"""
    cursor.execute(sql)
    owner = cursor.fetchone()
    
    print(f"DEBUG: Found owner: {owner}")
    
    if not owner:
        cursor.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Неверный логин/email или пароль'})
        }
    
    owner_id = str(owner['id'])
    owner_email = (owner['email'] or '').replace("'", "''")
    
    apartments = []
    
    if owner_email:
        sql = f"""SELECT apartment_id, owner_name as name 
           FROM t_p9202093_hotel_design_site.apartment_owners
           WHERE owner_email = '{owner_email}'"""
        cursor.execute(sql)
        apartments = cursor.fetchall()
    
    if not apartments and owner['apartment_number']:
        apartment_num = str(owner['apartment_number']).replace("'", "''")
        sql = f"""SELECT apartment_id, owner_name as name 
           FROM t_p9202093_hotel_design_site.apartment_owners
           WHERE apartment_id = '{apartment_num}'"""
        cursor.execute(sql)
        apartments = cursor.fetchall()
    
    cursor.close()
    
    import uuid
    token = str(uuid.uuid4())
    
    result_data = {
        'success': True,
        'token': token,
        'ownerId': owner_id,
        'ownerName': owner['name'],
        'apartments': [{'apartment_id': a['apartment_id'], 'name': a['name']} for a in apartments]
    }
    
    print(f"DEBUG: Login successful, returning: {result_data}")
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result_data)
    }