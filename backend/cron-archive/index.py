"""
Business: Автоматическая ежемесячная архивация отчётов (запускается по расписанию)
Args: event - dict с httpMethod, context - объект с атрибутами request_id и т.д.
Returns: HTTP response с результатом архивации
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS
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
    
    # Получаем предыдущий месяц
    today = datetime.now()
    first_day_current = today.replace(day=1)
    last_day_previous = first_day_current - timedelta(days=1)
    target_month = last_day_previous.strftime('%Y-%m')
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Получаем список всех апартаментов
        cursor.execute("SELECT DISTINCT apartment_id FROM owners ORDER BY apartment_id")
        apartments = cursor.fetchall()
        
        archived_count = 0
        
        for apt in apartments:
            apartment_id = apt['apartment_id']
            
            # Проверяем, есть ли уже архив
            cursor.execute(
                "SELECT id FROM monthly_reports WHERE apartment_id = %s AND month = %s",
                (apartment_id, target_month)
            )
            existing = cursor.fetchone()
            
            if existing:
                continue
            
            # Получаем бронирования за этот месяц
            cursor.execute("""
                SELECT * FROM bookings 
                WHERE apartment_id = %s 
                AND TO_CHAR(check_in, 'YYYY-MM') = %s
                ORDER BY check_in
            """, (apartment_id, target_month))
            
            bookings = cursor.fetchall()
            
            if not bookings:
                continue
            
            # Конвертируем даты в строки для JSON
            bookings_data = []
            for booking in bookings:
                booking_dict = dict(booking)
                if 'check_in' in booking_dict and booking_dict['check_in']:
                    booking_dict['check_in'] = booking_dict['check_in'].isoformat()
                if 'check_out' in booking_dict and booking_dict['check_out']:
                    booking_dict['check_out'] = booking_dict['check_out'].isoformat()
                bookings_data.append(booking_dict)
            
            # Подсчёт сумм
            total_amount = sum(float(b.get('total_amount', 0)) for b in bookings_data)
            owner_funds = sum(float(b.get('owner_funds', 0)) for b in bookings_data if b.get('showToGuest'))
            operating_expenses = sum(float(b.get('operating_expenses', 0)) for b in bookings_data)
            
            # Сохраняем архив
            cursor.execute("""
                INSERT INTO monthly_reports 
                (apartment_id, month, report_data, total_amount, owner_funds, operating_expenses)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                apartment_id,
                target_month,
                json.dumps(bookings_data, ensure_ascii=False),
                total_amount,
                owner_funds,
                operating_expenses
            ))
            
            archived_count += 1
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'month': target_month,
                'archived': archived_count,
                'message': f'Автоматически заархивировано {archived_count} отчётов за {target_month}'
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        conn.rollback()
        import traceback
        error_details = traceback.format_exc()
        print(f"Error: {error_details}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'details': error_details}, ensure_ascii=False)
        }
    finally:
        cursor.close()
        conn.close()