import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get and update owner reports from database
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with reports data or update status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method not in ['GET', 'PUT']:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
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