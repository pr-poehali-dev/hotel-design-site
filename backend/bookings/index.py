import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления бронированиями апартаментов
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            apartment_id = query_params.get('apartment_id')
            
            if apartment_id:
                cursor.execute("""
                    SELECT * FROM t_p9202093_hotel_design_site.bookings 
                    WHERE apartment_id = %s 
                    ORDER BY check_in DESC
                """, (apartment_id,))
            else:
                cursor.execute("""
                    SELECT * FROM t_p9202093_hotel_design_site.bookings 
                    ORDER BY check_in DESC
                """)
            
            bookings = cursor.fetchall()
            
            result = []
            for booking in bookings:
                total = float(booking['total_amount']) if booking['total_amount'] else 0
                commission = float(booking['aggregator_commission']) if booking['aggregator_commission'] else 0
                owner_funds = float(booking['owner_funds']) if booking.get('owner_funds') is not None else (total - commission)
                
                result.append({
                    'id': booking['id'],
                    'apartmentId': booking['apartment_id'],
                    'guestName': booking['guest_name'],
                    'guestEmail': booking['guest_email'],
                    'guestPhone': booking['guest_phone'],
                    'checkIn': str(booking['check_in']),
                    'checkOut': str(booking['check_out']),
                    'totalAmount': total,
                    'aggregatorCommission': commission,
                    'ownerFunds': owner_funds,
                    'isPrepaid': booking.get('is_prepaid', False),
                    'prepaymentAmount': float(booking['prepayment_amount']) if booking.get('prepayment_amount') else 0,
                    'prepaymentDate': str(booking['prepayment_date']) if booking.get('prepayment_date') else None,
                    'showToGuest': True,
                    'paymentStatus': 'paid' if booking.get('is_prepaid', False) else 'pending',
                    'expenses': {
                        'maid': float(booking['maid']) if booking.get('maid') else 0,
                        'laundry': float(booking['laundry']) if booking.get('laundry') else 0,
                        'hygiene': float(booking['hygiene']) if booking.get('hygiene') else 0,
                        'transport': float(booking['transport']) if booking.get('transport') else 0,
                        'compliment': float(booking['compliment']) if booking.get('compliment') else 0,
                        'other': float(booking['other']) if booking.get('other') else 0,
                        'otherNote': booking.get('other_note') or ''
                    }
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            booking_id = body_data.get('id')
            
            if not booking_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing booking id'})
                }
            
            cursor.execute("""
                UPDATE t_p9202093_hotel_design_site.bookings 
                SET is_prepaid = %s, 
                    prepayment_amount = %s,
                    prepayment_date = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, is_prepaid, prepayment_amount
            """, (
                body_data.get('is_prepaid', False),
                body_data.get('prepayment_amount', 0),
                booking_id
            ))
            
            updated_booking = cursor.fetchone()
            
            if not updated_booking:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking not found'})
                }
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': updated_booking['id'],
                    'is_prepaid': updated_booking['is_prepaid'],
                    'prepayment_amount': float(updated_booking['prepayment_amount']) if updated_booking['prepayment_amount'] else 0
                })
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            apartment_id = body_data.get('apartment_id')
            guest_name = body_data.get('guest_name')
            check_in = body_data.get('check_in')
            check_out = body_data.get('check_out')
            total_amount = body_data.get('total_amount', 0)
            
            if not all([apartment_id, guest_name, check_in, check_out]):
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            cursor.execute("""
                INSERT INTO t_p9202093_hotel_design_site.bookings 
                (id, apartment_id, guest_name, guest_email, guest_phone, check_in, check_out, 
                 accommodation_amount, total_amount, aggregator_commission, is_prepaid, prepayment_amount)
                VALUES (gen_random_uuid()::text, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, apartment_id, guest_name, check_in, check_out
            """, (
                apartment_id,
                guest_name,
                body_data.get('guest_email'),
                body_data.get('guest_phone'),
                check_in,
                check_out,
                total_amount,
                total_amount,
                body_data.get('aggregator_commission', 0),
                body_data.get('is_prepaid', False),
                body_data.get('prepayment_amount', 0)
            ))
            
            new_booking = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': new_booking['id'],
                    'apartment_id': new_booking['apartment_id'],
                    'guest_name': new_booking['guest_name'],
                    'check_in': str(new_booking['check_in']),
                    'check_out': str(new_booking['check_out'])
                })
            }
        
        cursor.close()
        conn.close()
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