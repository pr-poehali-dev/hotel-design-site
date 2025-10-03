import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage apartment owners (CRUD operations and get info by apartment ID)
    Args: event with httpMethod, body, params (apartment_id from path)
    Returns: HTTP response with owner data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            apartment_id = query_params.get('apartment_id')
            
            if apartment_id:
                cursor.execute(
                    "SELECT owner_email, owner_name FROM apartment_owners WHERE apartment_id = %s",
                    (apartment_id,)
                )
                row = cursor.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Owner not found'})
                    }
                
                owner_info = {
                    'ownerEmail': row[0],
                    'ownerName': row[1]
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(owner_info)
                }
            else:
                cursor.execute("SELECT apartment_id, owner_email, owner_name FROM apartment_owners ORDER BY apartment_id")
                rows = cursor.fetchall()
                
                owners = []
                for row in rows:
                    owners.append({
                        'apartmentId': row[0],
                        'ownerEmail': row[1],
                        'ownerName': row[2]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(owners)
                }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            apartment_id = body_data.get('apartmentId')
            owner_email = body_data.get('ownerEmail', '')
            owner_name = body_data.get('ownerName', '')
            
            if not apartment_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'apartmentId is required'})
                }
            
            cursor.execute(
                "INSERT INTO apartment_owners (apartment_id, owner_email, owner_name) VALUES (%s, %s, %s) "
                "ON CONFLICT (apartment_id) DO UPDATE SET owner_email = EXCLUDED.owner_email, owner_name = EXCLUDED.owner_name",
                (apartment_id, owner_email, owner_name)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    finally:
        cursor.close()
        conn.close()