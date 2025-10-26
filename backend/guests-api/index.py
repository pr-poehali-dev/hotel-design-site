"""
Business: API для управления гостями в админ-панели
Args: event с httpMethod, body, queryStringParameters
Returns: JSON с данными гостей или результатом операции
"""

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к БД через simple query protocol"""
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise ValueError('DATABASE_URL not found')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) if event.get('queryStringParameters') else {}
            guest_id = query_params.get('guestId', '') or query_params.get('guest_id', '')
            action = query_params.get('action', '')
            
            if guest_id and action == 'bookings':
                guest_query = f"SELECT * FROM t_p9202093_hotel_design_site.guests WHERE id = {guest_id}"
                cursor.execute(guest_query)
                guest = cursor.fetchone()
                
                if not guest:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Guest not found'}),
                        'isBase64Encoded': False
                    }
                
                bookings_query = f"""
                    SELECT b.*, r.number as apartment
                    FROM t_p9202093_hotel_design_site.bookings b
                    LEFT JOIN t_p9202093_hotel_design_site.rooms r ON b.apartment_id = r.id
                    WHERE b.guest_email = '{guest['email'].replace("'", "''")}' 
                       OR b.guest_phone = '{guest['phone'].replace("'", "''")}'
                    ORDER BY b.check_in DESC
                """
                cursor.execute(bookings_query)
                bookings = cursor.fetchall()
                
                bookings_list = []
                for booking in bookings:
                    booking_dict = {}
                    for key, value in booking.items():
                        if hasattr(value, 'isoformat'):
                            booking_dict[key] = value.isoformat()
                        elif str(type(value)) == "<class 'decimal.Decimal'>":
                            booking_dict[key] = float(value)
                        else:
                            booking_dict[key] = value
                    bookings_list.append(booking_dict)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'bookings': bookings_list}),
                    'isBase64Encoded': False
                }
            
            if guest_id:
                guest_query = f"SELECT * FROM t_p9202093_hotel_design_site.guests WHERE id = {guest_id}"
                cursor.execute(guest_query)
                guest = cursor.fetchone()
                
                if not guest:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Guest not found'}),
                        'isBase64Encoded': False
                    }
                
                bookings_query = f"""
                    SELECT * FROM t_p9202093_hotel_design_site.bookings 
                    WHERE guest_email = '{guest['email'].replace("'", "''")}' 
                       OR guest_phone = '{guest['phone'].replace("'", "''")}'
                    ORDER BY check_in DESC
                """
                cursor.execute(bookings_query)
                bookings = cursor.fetchall()
                
                bookings_list = []
                for booking in bookings:
                    booking_dict = {}
                    for key, value in booking.items():
                        if hasattr(value, 'isoformat'):
                            booking_dict[key] = value.isoformat()
                        elif str(type(value)) == "<class 'decimal.Decimal'>":
                            booking_dict[key] = float(value)
                        else:
                            booking_dict[key] = value
                    bookings_list.append(booking_dict)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'bookings': bookings_list}),
                    'isBase64Encoded': False
                }
            
            search = query_params.get('search', '')
            filter_type = query_params.get('filter', 'all')
            
            query = """
                SELECT 
                    g.*,
                    COUNT(DISTINCT b.id) as bookings_count,
                    COALESCE(SUM(b.total_amount), 0) as total_revenue,
                    MAX(b.check_out) as last_visit
                FROM t_p9202093_hotel_design_site.guests g
                LEFT JOIN t_p9202093_hotel_design_site.bookings b ON (
                    b.guest_email = g.email 
                    OR b.guest_phone = g.phone
                )
                WHERE 1=1
            """
            
            if search:
                search_pattern = f"%{search}%"
                query += f" AND (g.name ILIKE '{search_pattern}' OR g.email ILIKE '{search_pattern}' OR g.phone ILIKE '{search_pattern}')"
            
            if filter_type == 'vip':
                query += " AND g.is_vip = TRUE"
            elif filter_type == 'regular':
                query += " AND g.is_vip = FALSE"
            
            query += " GROUP BY g.id ORDER BY g.id DESC"
            
            cursor.execute(query)
            guests = cursor.fetchall()
            
            guests_list = []
            for guest in guests:
                guest_dict = {}
                for key, value in guest.items():
                    if hasattr(value, 'isoformat'):
                        guest_dict[key] = value.isoformat()
                    elif str(type(value)) == "<class 'decimal.Decimal'>":
                        guest_dict[key] = float(value)
                    else:
                        guest_dict[key] = value
                guests_list.append(guest_dict)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'guests': guests_list}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            name = body_data.get('name', '').replace("'", "''")
            email = body_data.get('email', '').replace("'", "''")
            phone = body_data.get('phone', '').replace("'", "''")
            is_vip = body_data.get('is_vip', False)
            notes = body_data.get('notes', '').replace("'", "''")
            login = body_data.get('login', '')
            password = body_data.get('password', '')
            bonus_points = body_data.get('bonus_points', 0)
            
            if not name or not email or not phone:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Name, email and phone are required'}),
                    'isBase64Encoded': False
                }
            
            if login:
                login_escaped = login.replace("'", "''")
                login_part = f"'{login_escaped}'"
            else:
                login_part = 'NULL'
            
            if password:
                password_escaped = password.replace("'", "''")
                password_part = f"'{password_escaped}'"
            else:
                password_part = 'NULL'
            
            insert_query = f"""
                INSERT INTO t_p9202093_hotel_design_site.guests (name, email, phone, is_vip, notes, login, password, bonus_points, created_at, updated_at)
                VALUES ('{name}', '{email}', '{phone}', {is_vip}, '{notes}', {login_part}, {password_part}, {bonus_points}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING *
            """
            
            cursor.execute(insert_query)
            conn.commit()
            guest = cursor.fetchone()
            
            guest_dict = {}
            for key, value in guest.items():
                if hasattr(value, 'isoformat'):
                    guest_dict[key] = value.isoformat()
                elif str(type(value)) == "<class 'decimal.Decimal'>":
                    guest_dict[key] = float(value)
                else:
                    guest_dict[key] = value
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'guest': guest_dict}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            guest_id = body_data.get('id')
            if not guest_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Guest ID is required'}),
                    'isBase64Encoded': False
                }
            
            name = body_data.get('name', '').replace("'", "''")
            email = body_data.get('email', '').replace("'", "''")
            phone = body_data.get('phone', '').replace("'", "''")
            is_vip = body_data.get('is_vip', False)
            notes = body_data.get('notes', '').replace("'", "''")
            login = body_data.get('login', '')
            password = body_data.get('password', '')
            bonus_points = body_data.get('bonus_points', 0)
            
            if login:
                login_escaped = login.replace("'", "''")
                login_part = f"login = '{login_escaped}'"
            else:
                login_part = 'login = NULL'
            
            if password:
                password_escaped = password.replace("'", "''")
                password_part = f"password = '{password_escaped}'"
            else:
                password_part = 'password = NULL'
            
            update_query = f"""
                UPDATE t_p9202093_hotel_design_site.guests 
                SET name = '{name}', 
                    email = '{email}', 
                    phone = '{phone}', 
                    is_vip = {is_vip}, 
                    notes = '{notes}',
                    {login_part},
                    {password_part},
                    bonus_points = {bonus_points},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = {guest_id}
                RETURNING *
            """
            
            cursor.execute(update_query)
            conn.commit()
            guest = cursor.fetchone()
            
            if not guest:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Guest not found'}),
                    'isBase64Encoded': False
                }
            
            guest_dict = {}
            for key, value in guest.items():
                if hasattr(value, 'isoformat'):
                    guest_dict[key] = value.isoformat()
                elif str(type(value)) == "<class 'decimal.Decimal'>":
                    guest_dict[key] = float(value)
                else:
                    guest_dict[key] = value
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'guest': guest_dict}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            guest_id = query_params.get('id') if query_params else None
            
            if not guest_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Guest ID is required'}),
                    'isBase64Encoded': False
                }
            
            delete_query = f"DELETE FROM t_p9202093_hotel_design_site.guests WHERE id = {guest_id} RETURNING id"
            cursor.execute(delete_query)
            conn.commit()
            deleted = cursor.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Guest not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Guest deleted successfully'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cursor.close()
        conn.close()