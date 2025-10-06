'''
Business: API для управления комнатами и горничными с синхронизацией в БД
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response dict с данными комнат и горничных
'''

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создание подключения к БД"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise Exception('DATABASE_URL not configured')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    }
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = event.get('queryStringParameters') or {}
        action = params.get('action', '')
        
        # GET - получение данных
        if method == 'GET':
            if action == 'rooms':
                cur.execute('''
                    SELECT id, number, floor, status, assigned_to, last_cleaned, 
                           urgent, notes, payment, payment_status, created_at, updated_at 
                    FROM rooms ORDER BY floor, number
                ''')
                rooms = [dict(row) for row in cur.fetchall()]
                # Конвертируем datetime в строки
                for room in rooms:
                    if room.get('last_cleaned'):
                        room['last_cleaned'] = room['last_cleaned'].strftime('%Y-%m-%d %H:%M')
                    if room.get('created_at'):
                        room['created_at'] = room['created_at'].isoformat()
                    if room.get('updated_at'):
                        room['updated_at'] = room['updated_at'].isoformat()
                    # Конвертируем Decimal в float
                    if room.get('payment') is not None:
                        room['payment'] = float(room['payment'])
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'rooms': rooms})
                }
            
            elif action == 'housekeepers':
                cur.execute('SELECT id, name, email, created_at FROM housekeepers ORDER BY name')
                housekeepers = []
                for row in cur.fetchall():
                    hk = dict(row)
                    if hk.get('created_at'):
                        hk['created_at'] = hk['created_at'].isoformat()
                    housekeepers.append(hk)
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'housekeepers': housekeepers})
                }
            
            else:
                # Возвращаем всё сразу
                cur.execute('''
                    SELECT id, number, floor, status, assigned_to, last_cleaned, 
                           urgent, notes, payment, payment_status, created_at, updated_at 
                    FROM rooms ORDER BY floor, number
                ''')
                rooms = [dict(row) for row in cur.fetchall()]
                for room in rooms:
                    if room.get('last_cleaned'):
                        room['last_cleaned'] = room['last_cleaned'].strftime('%Y-%m-%d %H:%M')
                    if room.get('created_at'):
                        room['created_at'] = room['created_at'].isoformat()
                    if room.get('updated_at'):
                        room['updated_at'] = room['updated_at'].isoformat()
                    if room.get('payment') is not None:
                        room['payment'] = float(room['payment'])
                
                cur.execute('SELECT id, name, email, created_at FROM housekeepers ORDER BY name')
                housekeepers = []
                for row in cur.fetchall():
                    hk = dict(row)
                    if hk.get('created_at'):
                        hk['created_at'] = hk['created_at'].isoformat()
                    housekeepers.append(hk)
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'rooms': rooms, 'housekeepers': housekeepers})
                }
        
        # POST - создание/обновление
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'add_room':
                room = body_data.get('room', {})
                cur.execute('''
                    INSERT INTO rooms (id, number, floor, status, assigned_to, urgent, notes, payment, payment_status, last_cleaned)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                ''', (
                    room['id'], room['number'], room['floor'], room['status'],
                    room.get('assignedTo', ''), room.get('urgent', False),
                    room.get('notes', ''), room.get('payment', 0), room.get('paymentStatus', 'unpaid')
                ))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'success': True, 'message': 'Комната добавлена'})
                }
            
            elif action == 'update_room':
                room = body_data.get('room', {})
                room_id = room.get('id')
                
                # Обновляем last_cleaned если статус стал clean
                last_cleaned_sql = ", last_cleaned = CURRENT_TIMESTAMP" if room.get('status') == 'clean' else ""
                
                cur.execute(f'''
                    UPDATE rooms 
                    SET number = %s, floor = %s, status = %s, assigned_to = %s,
                        urgent = %s, notes = %s, payment = %s, payment_status = %s, 
                        updated_at = CURRENT_TIMESTAMP
                        {last_cleaned_sql}
                    WHERE id = %s
                ''', (
                    room['number'], room['floor'], room['status'],
                    room.get('assignedTo', ''), room.get('urgent', False), 
                    room.get('notes', ''), room.get('payment', 0), 
                    room.get('paymentStatus', 'unpaid'), room_id
                ))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'success': True, 'message': 'Комната обновлена'})
                }
            
            elif action == 'add_housekeeper':
                name = body_data.get('name', '').strip()
                if not name:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Имя не может быть пустым'})
                    }
                
                cur.execute('INSERT INTO housekeepers (name) VALUES (%s) ON CONFLICT (name) DO NOTHING', (name,))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'success': True, 'message': 'Горничная добавлена'})
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Unknown action'})
                }
        
        # DELETE
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', '')
            
            if action == 'delete_room':
                room_id = body_data.get('id')
                cur.execute('DELETE FROM rooms WHERE id = %s', (room_id,))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'success': True, 'message': 'Комната удалена'})
                }
            
            elif action == 'delete_housekeeper':
                name = body_data.get('name')
                cur.execute('DELETE FROM housekeepers WHERE name = %s', (name,))
                cur.execute("UPDATE rooms SET assigned_to = '' WHERE assigned_to = %s", (name,))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'success': True, 'message': 'Горничная удалена'})
                }
        
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()