import json
import os
import psycopg2
from datetime import datetime, timedelta
import random
import string
from typing import Dict, Any

# Force redeploy

def generate_promo_code(discount: int) -> str:
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"WHEEL{discount}-{random_part}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Fortune wheel spin handler - saves spin results and generates promo codes
    Args: event with httpMethod, body (guest_email, guest_name, discount_percent, booking_id)
          context with request_id
    Returns: HTTP response with promo code or error
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
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        guest_email = body_data.get('guest_email')
        guest_name = body_data.get('guest_name', '')
        discount_percent = body_data.get('discount_percent')
        booking_id = body_data.get('booking_id')
        
        if not guest_email or not discount_percent:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'guest_email and discount_percent are required'})
            }
        
        if discount_percent not in [5, 10, 15, 20, 25, 30, 40, 50]:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid discount_percent'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database configuration error'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if booking_id:
            cur.execute(
                "SELECT COUNT(*) FROM t_p9202093_hotel_design_site.fortune_wheel_spins WHERE booking_id = %s",
                (booking_id,)
            )
            count = cur.fetchone()[0]
            
            if count > 0:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'This booking already used fortune wheel'})
                }
        
        promo_code = generate_promo_code(discount_percent)
        expiry_date = datetime.now() + timedelta(days=180)
        
        cur.execute(
            """
            INSERT INTO t_p9202093_hotel_design_site.fortune_wheel_spins 
            (guest_email, guest_name, booking_id, discount_percent, promo_code, expiry_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, promo_code, expiry_date
            """,
            (guest_email, guest_name, booking_id, discount_percent, promo_code, expiry_date)
        )
        
        result = cur.fetchone()
        spin_id = result[0]
        final_promo = result[1]
        final_expiry = result[2]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'spin_id': spin_id,
                'promo_code': final_promo,
                'discount_percent': discount_percent,
                'expiry_date': final_expiry.isoformat(),
                'message': f'Congratulations! Your {discount_percent}% discount code: {final_promo}'
            })
        }
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        guest_email = query_params.get('email')
        
        if not guest_email:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'email parameter is required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database configuration error'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        cur.execute(
            """
            SELECT id, discount_percent, promo_code, spin_date, is_used, expiry_date
            FROM t_p9202093_hotel_design_site.fortune_wheel_spins
            WHERE guest_email = %s
            ORDER BY spin_date DESC
            """,
            (guest_email,)
        )
        
        rows = cur.fetchall()
        
        spins = []
        for row in rows:
            spins.append({
                'id': row[0],
                'discount_percent': row[1],
                'promo_code': row[2],
                'spin_date': row[3].isoformat() if row[3] else None,
                'is_used': row[4],
                'expiry_date': row[5].isoformat() if row[5] else None,
                'is_expired': datetime.now() > row[5] if row[5] else False
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'spins': spins,
                'total': len(spins)
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }