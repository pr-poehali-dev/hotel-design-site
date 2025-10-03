import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage monthly reports archive (create, get by apartment and month)
    Args: event with httpMethod, queryStringParameters (apartment_id, month), body
    Returns: HTTP response with monthly reports data
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
            report_month = query_params.get('month')
            
            if apartment_id and report_month:
                cursor.execute(
                    '''SELECT id, apartment_id, report_month, report_data, total_amount, 
                       owner_funds, operating_expenses, bookings_count, created_at 
                       FROM monthly_reports 
                       WHERE apartment_id = %s AND report_month = %s''',
                    (apartment_id, report_month)
                )
                row = cursor.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Report not found'})
                    }
                
                report = {
                    'id': row[0],
                    'apartmentId': row[1],
                    'reportMonth': row[2],
                    'reportData': row[3],
                    'totalAmount': float(row[4]) if row[4] else 0,
                    'ownerFunds': float(row[5]) if row[5] else 0,
                    'operatingExpenses': float(row[6]) if row[6] else 0,
                    'bookingsCount': row[7],
                    'createdAt': str(row[8])
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(report)
                }
            
            elif apartment_id:
                cursor.execute(
                    '''SELECT id, apartment_id, report_month, total_amount, 
                       owner_funds, operating_expenses, bookings_count, created_at 
                       FROM monthly_reports 
                       WHERE apartment_id = %s 
                       ORDER BY report_month DESC''',
                    (apartment_id,)
                )
                rows = cursor.fetchall()
                
                reports = []
                for row in rows:
                    reports.append({
                        'id': row[0],
                        'apartmentId': row[1],
                        'reportMonth': row[2],
                        'totalAmount': float(row[3]) if row[3] else 0,
                        'ownerFunds': float(row[4]) if row[4] else 0,
                        'operatingExpenses': float(row[5]) if row[5] else 0,
                        'bookingsCount': row[6],
                        'createdAt': str(row[7])
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(reports)
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'apartment_id is required'})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            apartment_id = body_data.get('apartmentId')
            report_month = body_data.get('reportMonth')
            report_data = body_data.get('reportData', [])
            
            if not apartment_id or not report_month:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'apartmentId and reportMonth are required'})
                }
            
            total_amount = sum(b.get('totalAmount', 0) for b in report_data)
            owner_funds = sum(b.get('ownerFunds', 0) for b in report_data)
            operating_expenses = sum(b.get('operatingExpenses', 0) for b in report_data)
            bookings_count = len(report_data)
            
            cursor.execute(
                '''INSERT INTO monthly_reports 
                   (apartment_id, report_month, report_data, total_amount, owner_funds, 
                    operating_expenses, bookings_count) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (apartment_id, report_month) 
                   DO UPDATE SET 
                       report_data = EXCLUDED.report_data,
                       total_amount = EXCLUDED.total_amount,
                       owner_funds = EXCLUDED.owner_funds,
                       operating_expenses = EXCLUDED.operating_expenses,
                       bookings_count = EXCLUDED.bookings_count''',
                (apartment_id, report_month, json.dumps(report_data), 
                 total_amount, owner_funds, operating_expenses, bookings_count)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'message': 'Monthly report saved'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    finally:
        cursor.close()
        conn.close()
