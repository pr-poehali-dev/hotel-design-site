import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get owner reports from database
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with reports data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
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
    
    query = '''
        SELECT 
            id,
            apartment_number,
            check_in_date,
            check_out_date,
            booking_sum,
            total_sum,
            commission_percent,
            usn_percent,
            commission_before_usn,
            commission_after_usn,
            remaining_before_expenses,
            expenses_on_operations,
            average_cleaning,
            owner_payment,
            payment_date,
            hot_water,
            chemical_cleaning,
            hygiene_ср_ва,
            transportation,
            utilities,
            other,
            note_to_billing,
            created_at
        FROM owner_reports
        ORDER BY check_in_date DESC
    '''
    
    cur.execute(query)
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
