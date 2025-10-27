import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage owner commission rates for apartments
    Args: event - dict with httpMethod, body (for PUT)
          context - object with request_id attribute
    Returns: HTTP response with owners list or update confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT apartment_id, owner_name, owner_email, commission_rate
                FROM t_p9202093_hotel_design_site.apartment_owners
                ORDER BY apartment_id
            ''')
            
            owners = []
            for row in cur.fetchall():
                owners.append({
                    'apartment_id': row[0],
                    'apartment_number': None,
                    'apartment_name': None,
                    'owner_name': row[1],
                    'owner_email': row[2],
                    'commission_rate': float(row[3]) if row[3] else 0.0
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'owners': owners})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            apartment_id = body_data.get('apartment_id')
            commission_rate = body_data.get('commission_rate')
            
            if not apartment_id or commission_rate is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'apartment_id and commission_rate are required'})
                }
            
            cur.execute('''
                UPDATE t_p9202093_hotel_design_site.apartment_owners 
                SET commission_rate = %s
                WHERE apartment_id = %s
            ''', (commission_rate, apartment_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'apartment_id': apartment_id,
                    'commission_rate': commission_rate
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()