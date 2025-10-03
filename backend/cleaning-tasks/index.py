import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления задачами уборки - получение, создание, обновление статуса
    Args: event - dict with httpMethod, body, queryStringParameters, pathParams
          context - object with request_id attribute
    Returns: HTTP response dict with list of tasks or operation result
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            path_params = event.get('pathParams', {})
            task_id = path_params.get('id')
            
            if task_id:
                cur.execute('''
                    SELECT ct.id, ct.apartment_id, ct.maid_id, m.name as maid_name,
                           ct.cleaning_date, ct.cleaning_type, ct.status, 
                           ct.payment_amount, ct.notes, ct.created_at
                    FROM cleaning_tasks ct
                    LEFT JOIN maids m ON ct.maid_id = m.id
                    WHERE ct.id = %s
                ''', (task_id,))
                row = cur.fetchone()
                if row:
                    task = {
                        'id': row[0],
                        'apartment_id': row[1],
                        'maid_id': row[2],
                        'maid_name': row[3],
                        'cleaning_date': row[4].isoformat() if row[4] else None,
                        'cleaning_type': row[5],
                        'status': row[6],
                        'payment_amount': float(row[7]) if row[7] else None,
                        'notes': row[8],
                        'created_at': row[9].isoformat() if row[9] else None
                    }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(task)
                    }
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Task not found'})
                }
            
            cur.execute('''
                SELECT ct.id, ct.apartment_id, ct.maid_id, m.name as maid_name,
                       ct.cleaning_date, ct.cleaning_type, ct.status, 
                       ct.payment_amount, ct.notes, ct.created_at
                FROM cleaning_tasks ct
                LEFT JOIN maids m ON ct.maid_id = m.id
                ORDER BY ct.cleaning_date DESC, ct.created_at DESC
            ''')
            tasks = []
            for row in cur.fetchall():
                tasks.append({
                    'id': row[0],
                    'apartment_id': row[1],
                    'maid_id': row[2],
                    'maid_name': row[3],
                    'cleaning_date': row[4].isoformat() if row[4] else None,
                    'cleaning_type': row[5],
                    'status': row[6],
                    'payment_amount': float(row[7]) if row[7] else None,
                    'notes': row[8],
                    'created_at': row[9].isoformat() if row[9] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(tasks)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            apartment_id = body_data.get('apartment_id')
            maid_id = body_data.get('maid_id')
            cleaning_date = body_data.get('cleaning_date')
            cleaning_type = body_data.get('cleaning_type', 'checkout')
            payment_amount = body_data.get('payment_amount')
            notes = body_data.get('notes', '')
            
            if maid_id and not payment_amount:
                cur.execute('SELECT rate_per_cleaning FROM maids WHERE id = %s', (maid_id,))
                rate_row = cur.fetchone()
                if rate_row:
                    payment_amount = float(rate_row[0])
            
            cur.execute('''
                INSERT INTO cleaning_tasks 
                (apartment_id, maid_id, cleaning_date, cleaning_type, payment_amount, notes, status)
                VALUES (%s, %s, %s, %s, %s, %s, 'scheduled')
                RETURNING id
            ''', (apartment_id, maid_id, cleaning_date, cleaning_type, payment_amount, notes))
            
            task_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': task_id, 'message': 'Task created successfully'})
            }
        
        if method == 'PUT':
            path_params = event.get('pathParams', {})
            task_id = path_params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            
            status = body_data.get('status')
            maid_id = body_data.get('maid_id')
            payment_amount = body_data.get('payment_amount')
            notes = body_data.get('notes')
            
            if status == 'completed':
                cur.execute('''
                    UPDATE cleaning_tasks
                    SET status = %s, completed_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                ''', (status, task_id))
            elif status:
                cur.execute('''
                    UPDATE cleaning_tasks SET status = %s WHERE id = %s
                ''', (status, task_id))
            
            if maid_id is not None or payment_amount is not None or notes is not None:
                update_fields = []
                params = []
                
                if maid_id is not None:
                    update_fields.append('maid_id = %s')
                    params.append(maid_id)
                if payment_amount is not None:
                    update_fields.append('payment_amount = %s')
                    params.append(payment_amount)
                if notes is not None:
                    update_fields.append('notes = %s')
                    params.append(notes)
                
                if update_fields:
                    params.append(task_id)
                    cur.execute(f'''
                        UPDATE cleaning_tasks 
                        SET {', '.join(update_fields)}
                        WHERE id = %s
                    ''', params)
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Task updated successfully'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
