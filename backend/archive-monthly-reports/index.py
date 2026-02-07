'''
Business: Archive monthly reports automatically (run on 1st day of each month)
Args: event with httpMethod
Returns: HTTP response with archiving status
'''
import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta

# Force redeploy
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        last_month = datetime.now().replace(day=1) - timedelta(days=1)
        report_month = last_month.strftime('%Y-%m')
        
        cursor.execute('''
            SELECT DISTINCT apartment_id 
            FROM t_p9202093_hotel_design_site.bookings
        ''')
        apartments = cursor.fetchall()
        
        archived_count = 0
        
        for apt in apartments:
            apartment_id = apt['apartment_id']
            
            cursor.execute('''
                SELECT * FROM t_p9202093_hotel_design_site.bookings
                WHERE apartment_id = %s 
                AND TO_CHAR(check_in::date, 'YYYY-MM') = %s
                ORDER BY check_in
            ''', (apartment_id, report_month))
            
            bookings = cursor.fetchall()
            
            if not bookings:
                continue
            
            report_data = []
            total_amount = 0
            owner_funds = 0
            operating_expenses = 0
            
            for booking in bookings:
                total_amount += float(booking['total_amount'] or 0)
                owner_funds += float(booking['owner_funds'] or 0)
                operating_expenses += float(booking['operating_expenses'] or 0)
                
                report_data.append({
                    'id': booking['id'],
                    'checkIn': str(booking['check_in']),
                    'checkOut': str(booking['check_out']),
                    'guestName': booking['guest_name'],
                    'totalAmount': float(booking['total_amount'] or 0),
                    'ownerFunds': float(booking['owner_funds'] or 0),
                    'operatingExpenses': float(booking['operating_expenses'] or 0),
                    'managementCommission': float(booking['management_commission'] or 0),
                    'accommodationAmount': float(booking['accommodation_amount'] or 0),
                    'parking': float(booking['parking'] or 0),
                    'aggregatorCommission': float(booking['aggregator_commission'] or 0),
                    'remainderBeforeManagement': float(booking['remainder_before_management'] or 0),
                    'remainderBeforeExpenses': float(booking['remainder_before_expenses'] or 0),
                    'earlyCheckIn': float(booking['early_check_in'] or 0),
                    'lateCheckOut': float(booking['late_check_out'] or 0),
                    'taxAndBankCommission': float(booking['tax_and_bank_commission'] or 0),
                    'maid': float(booking['maid'] or 0),
                    'laundry': float(booking['laundry'] or 0),
                    'hygiene': float(booking['hygiene'] or 0),
                    'transport': float(booking['transport'] or 0),
                    'compliment': float(booking['compliment'] or 0),
                    'other': float(booking['other'] or 0),
                    'otherNote': booking['other_note'] or '',
                    'showToGuest': booking['show_to_guest'],
                    'paymentStatus': booking.get('payment_status', 'pending'),
                    'paymentCompletedAt': str(booking['payment_completed_at']) if booking.get('payment_completed_at') else None
                })
            
            cursor.execute('''
                INSERT INTO t_p9202093_hotel_design_site.monthly_reports 
                (apartment_id, report_month, report_data, total_amount, owner_funds, 
                 operating_expenses, bookings_count, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (apartment_id, report_month) 
                DO UPDATE SET 
                    report_data = EXCLUDED.report_data,
                    total_amount = EXCLUDED.total_amount,
                    owner_funds = EXCLUDED.owner_funds,
                    operating_expenses = EXCLUDED.operating_expenses,
                    bookings_count = EXCLUDED.bookings_count,
                    created_at = NOW()
            ''', (apartment_id, report_month, json.dumps(report_data), 
                  total_amount, owner_funds, operating_expenses, len(bookings)))
            
            archived_count += 1
        
        conn.commit()
        cursor.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True, 
                'message': f'Archived {archived_count} reports for {report_month}',
                'reportMonth': report_month,
                'archivedCount': archived_count
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if conn:
            conn.close()