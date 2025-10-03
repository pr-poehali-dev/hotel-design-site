import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка квартир собственника
    Args: event - httpMethod (GET/OPTIONS), queryStringParameters с ownerId
    Returns: HTTP response со списком квартир
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Owner-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters', {}) or {}
    owner_id = params.get('ownerId', '')
    
    if not owner_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'message': 'Owner ID required'})
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url, options="-c search_path=t_p9202093_hotel_design_site")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        safe_owner_id = owner_id.replace("'", "''")
        sql = f"SELECT full_name as name FROM t_p9202093_hotel_design_site.owner_users WHERE id = {safe_owner_id} AND is_active = true"
        cursor.execute(sql)
        owner = cursor.fetchone()
        
        if not owner:
            cursor.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': False, 'message': 'Owner not found'})
            }
        
        sql = f"""SELECT apartment_id, owner_name as name 
           FROM t_p9202093_hotel_design_site.apartment_owners
           WHERE owner_email = (SELECT email FROM t_p9202093_hotel_design_site.owner_users WHERE id = {safe_owner_id})
           ORDER BY apartment_id"""
        cursor.execute(sql)
        apartments = cursor.fetchall()
        cursor.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'ownerName': owner['name'],
                'apartments': [{'apartment_id': a['apartment_id'], 'name': a['name']} for a in apartments]
            })
        }
    finally:
        conn.close()