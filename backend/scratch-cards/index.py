import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime
import random
from typing import Dict, Any, List

# Force redeploy

def generate_scratch_cards(booking_id: str) -> List[Dict[str, Any]]:
    cards = []
    
    cards.extend([{'bonus_points': 0} for _ in range(10)])
    cards.extend([{'bonus_points': 1000} for _ in range(10)])
    cards.extend([{'bonus_points': 2000} for _ in range(5)])
    cards.extend([{'bonus_points': 3000} for _ in range(4)])
    cards.append({'bonus_points': 5000})
    
    random.shuffle(cards)
    
    for i, card in enumerate(cards):
        card['position'] = i
        card['booking_id'] = booking_id
    
    return cards

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Scratch cards game - 30 cards with bonus points after checkout
    Args: event with httpMethod, body (guest_id, booking_id, position for POST), queryStringParameters (guest_id, booking_id for GET)
          context with request_id
    Returns: HTTP response with cards data or scratch result
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
        booking_id = query_params.get('booking_id')
        
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
        
        if booking_id:
            # Escape single quotes in booking_id by doubling them
            booking_id_escaped = booking_id.replace("'", "''")
            
            cur.execute(f"""
                SELECT id, bonus_points, is_scratched, scratched_at
                FROM t_p9202093_hotel_design_site.scratch_cards
                WHERE guest_id = {guest_id_int} AND booking_id = '{booking_id_escaped}'
                """)
            
            card = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not card:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'has_card': False,
                        'booking_id': booking_id
                    })
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'has_card': True,
                    'is_scratched': card['is_scratched'],
                    'bonus_points': card['bonus_points'] if card['is_scratched'] else None,
                    'scratched_at': card['scratched_at'].isoformat() if card['scratched_at'] else None
                })
            }
        
        cur.execute(f"""
            SELECT id, booking_id, bonus_points, is_scratched, scratched_at, created_at
            FROM t_p9202093_hotel_design_site.scratch_cards
            WHERE guest_id = {guest_id_int}
            ORDER BY created_at DESC
            """)
        
        cards = cur.fetchall()
        
        cur.close()
        conn.close()
        
        result = []
        for card in cards:
            result.append({
                'id': str(card['id']),
                'booking_id': str(card['booking_id']),
                'bonus_points': card['bonus_points'],
                'is_scratched': card['is_scratched'],
                'scratched_at': card['scratched_at'].isoformat() if card['scratched_at'] else None,
                'created_at': card['created_at'].isoformat() if card['created_at'] else None
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'cards': result,
                'total': len(result)
            })
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', 'scratch')
        
        if action == 'create':
            guest_id = body_data.get('guest_id')
            booking_id = body_data.get('booking_id')
            
            if not guest_id or not booking_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'guest_id and booking_id are required'})
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
            
            # Escape single quotes in booking_id by doubling them
            booking_id_escaped = booking_id.replace("'", "''")
            
            cur.execute(f"SELECT id FROM t_p9202093_hotel_design_site.scratch_cards WHERE booking_id = '{booking_id_escaped}'")
            
            existing = cur.fetchone()
            
            if existing:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Card already exists for this booking'})
                }
            
            cards_data = generate_scratch_cards(booking_id)
            chosen_card = random.choice(cards_data)
            
            cur.execute(f"""
                INSERT INTO t_p9202093_hotel_design_site.scratch_cards
                (guest_id, booking_id, bonus_points)
                VALUES ({guest_id_int}, '{booking_id_escaped}', {chosen_card['bonus_points']})
                RETURNING id
                """)
            
            card_id = cur.fetchone()['id']
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'card_id': str(card_id),
                    'total_cards': 30
                })
            }
        
        if action == 'scratch':
            guest_id = body_data.get('guest_id')
            booking_id = body_data.get('booking_id')
            
            if not guest_id or not booking_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'guest_id and booking_id are required'})
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
                    'body': json.dumps({'error': 'guest_id and booking_id are required'})
                }
            
            # Escape single quotes in booking_id by doubling them
            booking_id_escaped = booking_id.replace("'", "''")
            
            cur.execute(f"""
                SELECT id, bonus_points, is_scratched
                FROM t_p9202093_hotel_design_site.scratch_cards
                WHERE guest_id = {guest_id_int} AND booking_id = '{booking_id_escaped}'
                """)
            
            card = cur.fetchone()
            
            if not card:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Card not found'})
                }
            
            if card['is_scratched']:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Card already scratched'})
                }
            
            bonus_points = card['bonus_points']
            card_id = card['id']
            
            # Get current timestamp for scratched_at
            scratched_at = datetime.now().isoformat()
            
            cur.execute(f"""
                UPDATE t_p9202093_hotel_design_site.scratch_cards
                SET is_scratched = true, scratched_at = '{scratched_at}'
                WHERE id = '{card_id}'
                """)
            
            if bonus_points > 0:
                cur.execute(f"""
                    UPDATE t_p9202093_hotel_design_site.guests
                    SET bonus_points = bonus_points + {bonus_points}
                    WHERE id = {guest_id_int}
                    RETURNING bonus_points
                    """)
                
                updated_guest = cur.fetchone()
                new_total = updated_guest['bonus_points'] if updated_guest else bonus_points
            else:
                cur.execute(f"SELECT bonus_points FROM t_p9202093_hotel_design_site.guests WHERE id = {guest_id_int}")
                guest_data = cur.fetchone()
                new_total = guest_data['bonus_points'] if guest_data else 0
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'bonus_points': bonus_points,
                    'total_bonus_points': new_total,
                    'message': f'Вы выиграли {bonus_points} баллов!' if bonus_points > 0 else 'К сожалению, эта карта без выигрыша'
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