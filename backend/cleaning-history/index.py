'''
Business: API для управления историей уборок апартаментов
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с историей уборок или результатом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any

DSN = os.environ['DATABASE_URL']

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(DSN)
    try:
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            housekeeper_name = params.get('housekeeper_name')
            
            if housekeeper_name:
                escaped_name = housekeeper_name.replace("'", "''")
                cur.execute(f'''
                    SELECT id, room_number, housekeeper_name, cleaned_at, 
                           payment_amount, payment_status, paid_at
                    FROM t_p9202093_hotel_design_site.cleaning_history
                    WHERE housekeeper_name = '{escaped_name}'
                    ORDER BY cleaned_at DESC
                ''')
            else:
                cur.execute('''
                    SELECT id, room_number, housekeeper_name, cleaned_at, 
                           payment_amount, payment_status, paid_at
                    FROM t_p9202093_hotel_design_site.cleaning_history
                    ORDER BY cleaned_at DESC
                ''')
            
            rows = cur.fetchall()
            records = []
            for row in rows:
                records.append({
                    'id': str(row[0]),
                    'roomNumber': row[1],
                    'housekeeperName': row[2],
                    'cleanedAt': row[3].isoformat() if row[3] else None,
                    'payment': float(row[4]),
                    'paymentStatus': row[5],
                    'paidAt': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'records': records})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            room_number = body_data.get('roomNumber')
            housekeeper_name = body_data.get('housekeeperName')
            payment = body_data.get('payment', 0)
            cleaned_at = body_data.get('cleanedAt')  # Дата уборки из апартамента
            
            if not room_number or not housekeeper_name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Не указан номер апартамента или имя горничной'})
                }
            
            escaped_room = room_number.replace("'", "''")
            escaped_name = housekeeper_name.replace("'", "''")
            
            # Используем дату из апартамента, если она указана, иначе текущую
            if cleaned_at:
                escaped_cleaned = cleaned_at.replace("'", "''")
                cur.execute(f'''
                    INSERT INTO t_p9202093_hotel_design_site.cleaning_history 
                    (room_number, housekeeper_name, payment_amount, cleaned_at)
                    VALUES ('{escaped_room}', '{escaped_name}', {payment}, '{escaped_cleaned}')
                    RETURNING id
                ''')
            else:
                cur.execute(f'''
                    INSERT INTO t_p9202093_hotel_design_site.cleaning_history 
                    (room_number, housekeeper_name, payment_amount)
                    VALUES ('{escaped_room}', '{escaped_name}', {payment})
                    RETURNING id
                ''')
            
            record_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'id': record_id})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            record_id = body_data.get('id')
            payment_status = body_data.get('paymentStatus')
            
            if not record_id or not payment_status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Не указан ID записи или статус оплаты'})
                }
            
            if payment_status == 'paid':
                cur.execute(f'''
                    UPDATE t_p9202093_hotel_design_site.cleaning_history
                    SET payment_status = 'paid', paid_at = NOW()
                    WHERE id = {record_id}
                ''')
            else:
                cur.execute(f'''
                    UPDATE t_p9202093_hotel_design_site.cleaning_history
                    SET payment_status = 'unpaid', paid_at = NULL
                    WHERE id = {record_id}
                ''')
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            record_id = body_data.get('id')
            
            if not record_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Не указан ID записи'})
                }
            
            cur.execute(f'''
                DELETE FROM t_p9202093_hotel_design_site.cleaning_history
                WHERE id = {record_id}
            ''')
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': False, 'error': 'Method not allowed'})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()