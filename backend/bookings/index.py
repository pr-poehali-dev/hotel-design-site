import json
import os
import uuid
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from datetime import datetime

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
                sql = f"""
                    SELECT * FROM t_p9202093_hotel_design_site.bookings 
                    WHERE apartment_id = '{apartment_id}' 
                    ORDER BY check_in DESC
                """
            else:
                sql = """
                    SELECT * FROM t_p9202093_hotel_design_site.bookings 
                    ORDER BY check_in DESC
                """
            
            cursor.execute(sql)
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
            
            is_prepaid = 'true' if body_data.get('is_prepaid', False) else 'false'
            prepayment_amount = body_data.get('prepayment_amount', 0)
            
            sql = f"""
                UPDATE t_p9202093_hotel_design_site.bookings 
                SET is_prepaid = {is_prepaid}, 
                    prepayment_amount = {prepayment_amount},
                    prepayment_date = CURRENT_TIMESTAMP
                WHERE id = '{booking_id}'
                RETURNING id, is_prepaid, prepayment_amount
            """
            
            cursor.execute(sql)
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
            guest_name = body_data.get('guest_name', '')
            guest_email = body_data.get('guest_email', '')
            guest_phone = body_data.get('guest_phone', '')
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
            
            cursor.execute(f"SELECT bnovo_name, number FROM t_p9202093_hotel_design_site.rooms WHERE id = '{apartment_id}'")
            room_data = cursor.fetchone()
            apartment_name = room_data[0] if room_data and room_data[0] else (room_data[1] if room_data else apartment_id)
            
            cursor.close()
            conn.close()
            
            booking_id = str(uuid.uuid4())
            
            notification_sent = False
            try:
                notify_url = 'https://functions.poehali.dev/d5dc60a9-f757-4cdf-bde4-995f24309d3f'
                notify_payload = {
                    'booking_id': booking_id,
                    'guest_name': guest_name,
                    'guest_email': guest_email,
                    'guest_phone': guest_phone,
                    'apartment_id': apartment_id,
                    'apartment_name': apartment_name,
                    'check_in': check_in,
                    'check_out': check_out,
                    'total_amount': total_amount
                }
                
                notify_response = requests.post(notify_url, json=notify_payload, timeout=5)
                notification_sent = notify_response.status_code == 200
            except Exception as e:
                print(f'Notification failed: {str(e)}')
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': booking_id,
                    'apartmentId': apartment_id,
                    'guestName': guest_name,
                    'checkIn': check_in,
                    'checkOut': check_out,
                    'notificationSent': notification_sent
                })
            }
        
        if method == 'PATCH':
            body_data = json.loads(event.get('body', '{}'))
            booking_id = body_data.get('id')
            expenses = body_data.get('expenses', {})
            
            if not booking_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing booking id'})
                }
            
            maid = expenses.get('maid', 0)
            laundry = expenses.get('laundry', 0)
            hygiene = expenses.get('hygiene', 0)
            transport = expenses.get('transport', 0)
            compliment = expenses.get('compliment', 0)
            other = expenses.get('other', 0)
            other_note = expenses.get('otherNote', '').replace("'", "''")
            
            total_expenses = maid + laundry + hygiene + transport + compliment + other
            
            cursor.execute(f"""
                SELECT total_amount, aggregator_commission 
                FROM t_p9202093_hotel_design_site.bookings 
                WHERE id = '{booking_id}'
            """)
            
            booking_data = cursor.fetchone()
            if not booking_data:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking not found'})
                }
            
            total_amount = float(booking_data['total_amount']) if booking_data['total_amount'] else 0
            commission = float(booking_data['aggregator_commission']) if booking_data['aggregator_commission'] else 0
            owner_funds = total_amount - commission - total_expenses
            
            sql = f"""
                UPDATE t_p9202093_hotel_design_site.bookings 
                SET maid = {maid},
                    laundry = {laundry},
                    hygiene = {hygiene},
                    transport = {transport},
                    compliment = {compliment},
                    other = {other},
                    other_note = '{other_note}',
                    owner_funds = {owner_funds}
                WHERE id = '{booking_id}'
                RETURNING id, maid, laundry, hygiene, transport, compliment, other, other_note, owner_funds
            """
            
            cursor.execute(sql)
            updated = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': updated['id'],
                    'expenses': {
                        'maid': float(updated['maid']) if updated['maid'] else 0,
                        'laundry': float(updated['laundry']) if updated['laundry'] else 0,
                        'hygiene': float(updated['hygiene']) if updated['hygiene'] else 0,
                        'transport': float(updated['transport']) if updated['transport'] else 0,
                        'compliment': float(updated['compliment']) if updated['compliment'] else 0,
                        'other': float(updated['other']) if updated['other'] else 0,
                        'otherNote': updated['other_note'] or ''
                    },
                    'ownerFunds': float(updated['owner_funds']) if updated['owner_funds'] else 0
                })
            }
        
        if method == 'DELETE':
            query_params = event.get('queryStringParameters', {}) or {}
            booking_id = query_params.get('id')
            
            if not booking_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing booking id'})
                }
            
            cursor.execute(f"""
                DELETE FROM t_p9202093_hotel_design_site.bookings 
                WHERE id = '{booking_id}'
                RETURNING id
            """)
            
            deleted = cursor.fetchone()
            if not deleted:
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
                'body': json.dumps({'success': True, 'id': deleted['id']})
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
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }