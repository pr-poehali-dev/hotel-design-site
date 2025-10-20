import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
from datetime import datetime, timedelta

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Синхронизация тарифов и доступности из Bnovo в availability_calendar
    Args: event - dict с httpMethod
          context - объект с атрибутами request_id
    Returns: HTTP response с результатом синхронизации тарифов
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        import psycopg2
        import psycopg2.extras
        
        database_url = os.environ.get('DATABASE_URL', '')
        account_id = os.environ.get('BNOVO_ACCOUNT_ID', '')
        password = os.environ.get('BNOVO_PASSWORD', '')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'})
            }
        
        auth_url = 'https://api.pms.bnovo.ru/api/v1/auth'
        auth_payload = {
            'id': int(account_id),
            'password': password
        }
        
        auth_request = urllib.request.Request(
            auth_url,
            data=json.dumps(auth_payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(auth_request, timeout=30) as auth_response:
            auth_data = json.loads(auth_response.read().decode())
        
        jwt_token = auth_data.get('data', {}).get('access_token')
        
        if not jwt_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Failed to get Bnovo token'})
            }
        
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("SELECT id, bnovo_id FROM t_p9202093_hotel_design_site.rooms WHERE bnovo_id IS NOT NULL")
        rooms = cur.fetchall()
        
        total_synced = 0
        date_from = datetime.now().date()
        date_to = date_from + timedelta(days=365)
        
        for room in rooms:
            room_id = room['id']
            bnovo_room_id = room['bnovo_id']
            
            params = urllib.parse.urlencode({
                'room_id': bnovo_room_id,
                'date_from': date_from.isoformat(),
                'date_to': date_to.isoformat()
            })
            rates_url = f'https://api.pms.bnovo.ru/api/v1/rates?{params}'
            
            rates_request = urllib.request.Request(
                rates_url,
                headers={
                    'Authorization': f'Bearer {jwt_token}',
                    'Accept': 'application/json'
                }
            )
            
            try:
                with urllib.request.urlopen(rates_request, timeout=30) as response:
                    rates_data = json.loads(response.read().decode())
                
                rates_list = rates_data.get('data', {}).get('rates', [])
                
                for rate in rates_list:
                    rate_date = rate.get('date')
                    price = rate.get('price', 0)
                    available = rate.get('available', True)
                    min_days = rate.get('min_days', 1)
                    
                    if rate_date:
                        cur.execute("""
                            INSERT INTO t_p9202093_hotel_design_site.availability_calendar 
                            (room_id, date, is_available, price)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (room_id, date) 
                            DO UPDATE SET 
                                price = EXCLUDED.price,
                                is_available = CASE 
                                    WHEN t_p9202093_hotel_design_site.availability_calendar.booking_id IS NOT NULL 
                                    THEN false 
                                    ELSE EXCLUDED.is_available 
                                END
                        """, (room_id, rate_date, available, price))
                        total_synced += 1
                
            except Exception as e:
                print(f"Error fetching rates for room {bnovo_room_id}: {e}")
                continue
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'synced_dates': total_synced,
                'rooms_processed': len(rooms)
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            })
        }
