import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime, timedelta
import random
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Fortune wheel with bonus points - spin once per week, get history
    Args: event with httpMethod, body (guest_id for POST), queryStringParameters (guest_id for GET, action=history)
          context with request_id
    Returns: HTTP response with spin result, next available time, or history
    '''
    method: str = event.get('httpMethod', 'GET')
    
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
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database configuration error'})
        }
    
    conn = psycopg2.connect(database_url)
    conn.set_session(autocommit=False)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        guest_id = query_params.get('guest_id')
        action = query_params.get('action', 'status')
        
        if not guest_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'guest_id is required'})
            }
        
        try:
            guest_id_int = int(guest_id)
        except ValueError:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'guest_id must be a valid integer'})
            }
        
        if action == 'history':
            cur.execute(f"""
                SELECT bonus_points, spin_date
                FROM t_p9202093_hotel_design_site.fortune_wheel_bonus_spins
                WHERE guest_id = {guest_id_int}
                ORDER BY spin_date DESC
                LIMIT 50
            """)
            
            history = cur.fetchall()
            
            cur.close()
            conn.close()
            
            history_list = [
                {
                    'bonus_points': row['bonus_points'],
                    'spin_date': row['spin_date'].isoformat() if row['spin_date'] else None
                }
                for row in history
            ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'history': history_list,
                    'total_spins': len(history_list)
                })
            }
        
        cur.execute(f"""
            SELECT next_spin_available, bonus_points, spin_date
            FROM t_p9202093_hotel_design_site.fortune_wheel_bonus_spins
            WHERE guest_id = {guest_id_int}
            ORDER BY spin_date DESC
            LIMIT 1
        """)
        
        last_spin = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not last_spin:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'can_spin': True,
                    'next_spin_available': None,
                    'last_bonus': None
                })
            }
        
        now = datetime.now()
        next_available = last_spin['next_spin_available']
        can_spin = now >= next_available
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'can_spin': can_spin,
                'next_spin_available': next_available.isoformat() if next_available else None,
                'last_bonus': last_spin['bonus_points'],
                'last_spin_date': last_spin['spin_date'].isoformat() if last_spin['spin_date'] else None
            })
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        guest_id = body_data.get('guest_id')
        
        if not guest_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'guest_id is required'})
            }
        
        try:
            guest_id_int = int(guest_id)
        except ValueError:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'guest_id must be a valid integer'})
            }
        
        cur.execute(f"""
            SELECT next_spin_available
            FROM t_p9202093_hotel_design_site.fortune_wheel_bonus_spins
            WHERE guest_id = {guest_id_int}
            ORDER BY spin_date DESC
            LIMIT 1
        """)
        
        last_spin = cur.fetchone()
        now = datetime.now()
        
        if last_spin and now < last_spin['next_spin_available']:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Cannot spin yet',
                    'next_spin_available': last_spin['next_spin_available'].isoformat()
                })
            }
        
        wheel_config = [
            500, 1000, 500, 1000, 500, 1000,
            1000, 1000, 1000, 5000, 10000, 500
        ]
        
        bonus_points = random.choice(wheel_config)
        next_spin_time = now + timedelta(weeks=1)
        next_spin_time_str = next_spin_time.strftime('%Y-%m-%d %H:%M:%S.%f')
        
        cur.execute(f"""
            INSERT INTO t_p9202093_hotel_design_site.fortune_wheel_bonus_spins
            (guest_id, bonus_points, next_spin_available)
            VALUES ({guest_id_int}, {bonus_points}, '{next_spin_time_str}')
            RETURNING id
        """)
        
        spin_id = cur.fetchone()['id']
        
        cur.execute(f"""
            UPDATE t_p9202093_hotel_design_site.guests
            SET bonus_points = bonus_points + {bonus_points}
            WHERE id = {guest_id_int}
            RETURNING bonus_points
        """)
        
        updated_guest = cur.fetchone()
        new_total = updated_guest['bonus_points'] if updated_guest else bonus_points
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'spin_id': str(spin_id),
                'bonus_points': bonus_points,
                'total_bonus_points': new_total,
                'next_spin_available': next_spin_time.isoformat()
            })
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
