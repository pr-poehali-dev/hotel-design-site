import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get, create, update and delete bookings with owner reports sync
    Args: event - dict with httpMethod, body, queryStringParameters, pathParameters
          context - object with request_id attribute
    Returns: HTTP response with bookings/reports data or operation status
    '''
    method: str = event.get('httpMethod', 'GET')
    path = event.get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        # Handle bookings API (new system)
        params = event.get('queryStringParameters', {}) or {}
        
        if 'apartment_id' in params or method in ['POST', 'DELETE']:
            return handle_bookings_api(method, params, event, cur, conn)
        
        # Handle old reports API (legacy)
        return handle_legacy_reports(method, event, cur, conn)
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals() and cur:
            cur.close()
        if 'conn' in locals() and conn:
            conn.close()

def handle_bookings_api(method: str, params: Dict, event: Dict, cur, conn) -> Dict[str, Any]:
    '''Handle new bookings API with database sync'''
    
    if method == 'GET':
        apartment_id = params.get('apartment_id')
        if not apartment_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'apartment_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute('''
            SELECT 
                id, apartment_id, check_in, check_out, early_check_in, late_check_out,
                parking, accommodation_amount, total_amount, aggregator_commission,
                tax_and_bank_commission, remainder_before_management, management_commission,
                remainder_before_expenses, operating_expenses, owner_funds, payment_to_owner,
                payment_date, maid, laundry, hygiene, transport, compliment, other,
                other_note, guest_name, guest_email, guest_phone, show_to_guest,
                created_at, updated_at
            FROM bookings 
            WHERE apartment_id = %s 
            ORDER BY check_in DESC
        ''', (apartment_id,))
        
        rows = cur.fetchall()
        bookings = []
        for row in rows:
            bookings.append({
                'id': row[0],
                'apartmentId': row[1],
                'checkIn': str(row[2]),
                'checkOut': str(row[3]),
                'earlyCheckIn': float(row[4]) if row[4] else 0,
                'lateCheckOut': float(row[5]) if row[5] else 0,
                'parking': float(row[6]) if row[6] else 0,
                'accommodationAmount': float(row[7]) if row[7] else 0,
                'totalAmount': float(row[8]) if row[8] else 0,
                'aggregatorCommission': float(row[9]) if row[9] else 0,
                'taxAndBankCommission': float(row[10]) if row[10] else 0,
                'remainderBeforeManagement': float(row[11]) if row[11] else 0,
                'managementCommission': float(row[12]) if row[12] else 0,
                'remainderBeforeExpenses': float(row[13]) if row[13] else 0,
                'operatingExpenses': float(row[14]) if row[14] else 0,
                'ownerFunds': float(row[15]) if row[15] else 0,
                'paymentToOwner': float(row[16]) if row[16] else 0,
                'paymentDate': str(row[17]) if row[17] else '',
                'maid': float(row[18]) if row[18] else 0,
                'laundry': float(row[19]) if row[19] else 0,
                'hygiene': float(row[20]) if row[20] else 0,
                'transport': float(row[21]) if row[21] else 0,
                'compliment': float(row[22]) if row[22] else 0,
                'other': float(row[23]) if row[23] else 0,
                'otherNote': row[24] or '',
                'guestName': row[25] or '',
                'guestEmail': row[26] or '',
                'guestPhone': row[27] or '',
                'showToGuest': row[28] or False
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(bookings),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        cur.execute('''
            INSERT INTO bookings (
                id, apartment_id, check_in, check_out, early_check_in, late_check_out,
                parking, accommodation_amount, total_amount, aggregator_commission,
                tax_and_bank_commission, remainder_before_management, management_commission,
                remainder_before_expenses, operating_expenses, owner_funds, payment_to_owner,
                payment_date, maid, laundry, hygiene, transport, compliment, other,
                other_note, guest_name, guest_email, guest_phone, show_to_guest
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        ''', (
            body_data['id'], body_data['apartmentId'], body_data['checkIn'], body_data['checkOut'],
            body_data.get('earlyCheckIn', 0), body_data.get('lateCheckOut', 0),
            body_data.get('parking', 0), body_data['accommodationAmount'], body_data['totalAmount'],
            body_data.get('aggregatorCommission', 0), body_data.get('taxAndBankCommission', 0),
            body_data.get('remainderBeforeManagement', 0), body_data.get('managementCommission', 0),
            body_data.get('remainderBeforeExpenses', 0), body_data.get('operatingExpenses', 0),
            body_data.get('ownerFunds', 0), body_data.get('paymentToOwner', 0),
            body_data.get('paymentDate') or None, body_data.get('maid', 0), body_data.get('laundry', 0),
            body_data.get('hygiene', 0), body_data.get('transport', 0), body_data.get('compliment', 0),
            body_data.get('other', 0), body_data.get('otherNote', ''), body_data.get('guestName', ''),
            body_data.get('guestEmail', ''), body_data.get('guestPhone', ''), body_data.get('showToGuest', False)
        ))
        
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        
        cur.execute('''
            UPDATE bookings SET
                check_in = %s, check_out = %s, early_check_in = %s, late_check_out = %s,
                parking = %s, accommodation_amount = %s, total_amount = %s, aggregator_commission = %s,
                tax_and_bank_commission = %s, remainder_before_management = %s, management_commission = %s,
                remainder_before_expenses = %s, operating_expenses = %s, owner_funds = %s, payment_to_owner = %s,
                payment_date = %s, maid = %s, laundry = %s, hygiene = %s, transport = %s, compliment = %s,
                other = %s, other_note = %s, guest_name = %s, guest_email = %s, guest_phone = %s,
                show_to_guest = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND apartment_id = %s
        ''', (
            body_data['checkIn'], body_data['checkOut'], body_data.get('earlyCheckIn', 0),
            body_data.get('lateCheckOut', 0), body_data.get('parking', 0), body_data['accommodationAmount'],
            body_data['totalAmount'], body_data.get('aggregatorCommission', 0),
            body_data.get('taxAndBankCommission', 0), body_data.get('remainderBeforeManagement', 0),
            body_data.get('managementCommission', 0), body_data.get('remainderBeforeExpenses', 0),
            body_data.get('operatingExpenses', 0), body_data.get('ownerFunds', 0),
            body_data.get('paymentToOwner', 0), body_data.get('paymentDate') or None,
            body_data.get('maid', 0), body_data.get('laundry', 0), body_data.get('hygiene', 0),
            body_data.get('transport', 0), body_data.get('compliment', 0), body_data.get('other', 0),
            body_data.get('otherNote', ''), body_data.get('guestName', ''), body_data.get('guestEmail', ''),
            body_data.get('guestPhone', ''), body_data.get('showToGuest', False),
            body_data['id'], body_data['apartmentId']
        ))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        booking_id = params.get('id')
        apartment_id = params.get('apartment_id')
        
        if not booking_id or not apartment_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'id and apartment_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute('DELETE FROM bookings WHERE id = %s AND apartment_id = %s', (booking_id, apartment_id))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def handle_legacy_reports(method: str, event: Dict, cur, conn) -> Dict[str, Any]:
    '''Handle legacy owner reports API'''
    
    if method not in ['GET', 'PUT']:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    user_apartments = []
    user_role = None
    
    if user_id:
        cur.execute('''
            SELECT role, apartment_numbers 
            FROM report_users 
            WHERE id = %s AND is_active = TRUE
        ''', (user_id,))
        user_data = cur.fetchone()
        
        if user_data:
            user_role = user_data[0]
            user_apartments = user_data[1] if user_data[1] else []
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        report_id = body_data.get('id')
        
        if not report_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Report ID is required'})
            }
        
        update_query = '''
            UPDATE owner_reports SET
                apartment_number = %s,
                check_in_date = %s,
                check_out_date = %s,
                booking_sum = %s,
                total_sum = %s,
                commission_percent = %s,
                usn_percent = %s,
                commission_before_usn = %s,
                commission_after_usn = %s,
                remaining_before_expenses = %s,
                expenses_on_operations = %s,
                average_cleaning = %s,
                owner_payment = %s,
                payment_date = %s,
                hot_water = %s,
                chemical_cleaning = %s,
                hygiene_ср_ва = %s,
                transportation = %s,
                utilities = %s,
                other = %s,
                note_to_billing = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        '''
        
        cur.execute(update_query, (
            body_data.get('apartment_number'),
            body_data.get('check_in_date'),
            body_data.get('check_out_date'),
            body_data.get('booking_sum'),
            body_data.get('total_sum'),
            body_data.get('commission_percent'),
            body_data.get('usn_percent'),
            body_data.get('commission_before_usn'),
            body_data.get('commission_after_usn'),
            body_data.get('remaining_before_expenses'),
            body_data.get('expenses_on_operations'),
            body_data.get('average_cleaning'),
            body_data.get('owner_payment'),
            body_data.get('payment_date') or None,
            body_data.get('hot_water'),
            body_data.get('chemical_cleaning'),
            body_data.get('hygiene_ср_ва'),
            body_data.get('transportation'),
            body_data.get('utilities'),
            body_data.get('other'),
            body_data.get('note_to_billing'),
            report_id
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Report updated successfully'})
        }
    
    if user_role == 'admin':
        query = '''
            SELECT 
                id, apartment_number, check_in_date, check_out_date,
                booking_sum, total_sum, commission_percent, usn_percent,
                commission_before_usn, commission_after_usn,
                remaining_before_expenses, expenses_on_operations,
                average_cleaning, owner_payment, payment_date,
                hot_water, chemical_cleaning, hygiene_ср_ва,
                transportation, utilities, other,
                note_to_billing, created_at
            FROM owner_reports
            ORDER BY check_in_date DESC
        '''
        cur.execute(query)
    elif user_apartments:
        query = '''
            SELECT 
                id, apartment_number, check_in_date, check_out_date,
                booking_sum, total_sum, commission_percent, usn_percent,
                commission_before_usn, commission_after_usn,
                remaining_before_expenses, expenses_on_operations,
                average_cleaning, owner_payment, payment_date,
                hot_water, chemical_cleaning, hygiene_ср_ва,
                transportation, utilities, other,
                note_to_billing, created_at
            FROM owner_reports
            WHERE apartment_number = ANY(%s)
            ORDER BY check_in_date DESC
        '''
        cur.execute(query, (user_apartments,))
    else:
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'reports': []})
        }
    
    rows = cur.fetchall()
    
    reports = []
    for row in rows:
        reports.append({
            'id': row[0],
            'apartment_number': row[1],
            'check_in_date': str(row[2]),
            'check_out_date': str(row[3]),
            'booking_sum': float(row[4]) if row[4] else 0,
            'total_sum': float(row[5]) if row[5] else 0,
            'commission_percent': float(row[6]) if row[6] else 0,
            'usn_percent': float(row[7]) if row[7] else 0,
            'commission_before_usn': float(row[8]) if row[8] else 0,
            'commission_after_usn': float(row[9]) if row[9] else 0,
            'remaining_before_expenses': float(row[10]) if row[10] else 0,
            'expenses_on_operations': float(row[11]) if row[11] else 0,
            'average_cleaning': float(row[12]) if row[12] else 0,
            'owner_payment': float(row[13]) if row[13] else 0,
            'payment_date': str(row[14]) if row[14] else None,
            'hot_water': float(row[15]) if row[15] else 0,
            'chemical_cleaning': float(row[16]) if row[16] else 0,
            'hygiene_ср_ва': float(row[17]) if row[17] else 0,
            'transportation': float(row[18]) if row[18] else 0,
            'utilities': float(row[19]) if row[19] else 0,
            'other': float(row[20]) if row[20] else 0,
            'note_to_billing': row[21],
            'created_at': str(row[22])
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'reports': reports})
    }