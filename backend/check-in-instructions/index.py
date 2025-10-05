import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление инструкциями по заселению (сохранение и получение)
    Args: event с httpMethod, body, queryStringParameters; context с request_id
    Returns: HTTP response с инструкциями или статусом сохранения
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # CORS OPTIONS
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
    
    # Подключение к БД
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            # Получение инструкций
            params = event.get('queryStringParameters') or {}
            apartment_id = params.get('apartment_id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if apartment_id:
                    # Получить инструкции конкретного апартамента
                    cur.execute(
                        "SELECT * FROM check_in_instructions WHERE apartment_id = '" + apartment_id + "' ORDER BY updated_at DESC LIMIT 1"
                    )
                    result = cur.fetchone()
                    
                    if result:
                        # Преобразуем timestamp в строку
                        if result.get('created_at'):
                            result['created_at'] = result['created_at'].isoformat()
                        if result.get('updated_at'):
                            result['updated_at'] = result['updated_at'].isoformat()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(result if result else None)
                    }
                else:
                    # Получить все инструкции
                    cur.execute(
                        "SELECT * FROM check_in_instructions ORDER BY updated_at DESC"
                    )
                    results = cur.fetchall()
                    
                    # Преобразуем timestamp в строку для каждой записи
                    for result in results:
                        if result.get('created_at'):
                            result['created_at'] = result['created_at'].isoformat()
                        if result.get('updated_at'):
                            result['updated_at'] = result['updated_at'].isoformat()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(results)
                    }
        
        elif method == 'POST':
            # Создание или обновление инструкций
            body_data = json.loads(event.get('body', '{}'))
            
            apartment_id = body_data.get('apartment_id')
            title = body_data.get('title', '')
            description = body_data.get('description', '')
            images = body_data.get('images', [])
            pdf_files = body_data.get('pdf_files', [])
            instruction_text = body_data.get('instruction_text', '')
            important_notes = body_data.get('important_notes', '')
            contact_info = body_data.get('contact_info', '')
            wifi_info = body_data.get('wifi_info', '')
            parking_info = body_data.get('parking_info', '')
            house_rules = body_data.get('house_rules', '')
            
            with conn.cursor() as cur:
                # Проверяем, есть ли уже инструкция для этого апартамента
                cur.execute(
                    "SELECT id FROM check_in_instructions WHERE apartment_id = '" + apartment_id + "'"
                )
                existing = cur.fetchone()
                
                if existing:
                    # Обновляем существующую
                    instruction_id = existing[0]
                    pdf_array = "ARRAY[" + ','.join(["'" + pdf.replace("'", "''") + "'" for pdf in pdf_files]) + "]" if pdf_files else "ARRAY[]::text[]"
                    cur.execute(
                        "UPDATE check_in_instructions SET " +
                        "title = '" + title.replace("'", "''") + "', " +
                        "description = '" + description.replace("'", "''") + "', " +
                        "images = ARRAY[" + ','.join(["'" + img.replace("'", "''") + "'" for img in images]) + "], " +
                        "pdf_files = " + pdf_array + ", " +
                        "instruction_text = '" + instruction_text.replace("'", "''") + "', " +
                        "important_notes = '" + important_notes.replace("'", "''") + "', " +
                        "contact_info = '" + contact_info.replace("'", "''") + "', " +
                        "wifi_info = '" + wifi_info.replace("'", "''") + "', " +
                        "parking_info = '" + parking_info.replace("'", "''") + "', " +
                        "house_rules = '" + house_rules.replace("'", "''") + "', " +
                        "updated_at = CURRENT_TIMESTAMP " +
                        "WHERE id = '" + instruction_id + "'"
                    )
                else:
                    # Создаём новую
                    import uuid
                    instruction_id = str(uuid.uuid4())
                    
                    images_array = "ARRAY[" + ','.join(["'" + img.replace("'", "''") + "'" for img in images]) + "]" if images else "ARRAY[]::text[]"
                    pdf_array = "ARRAY[" + ','.join(["'" + pdf.replace("'", "''") + "'" for pdf in pdf_files]) + "]" if pdf_files else "ARRAY[]::text[]"
                    
                    cur.execute(
                        "INSERT INTO check_in_instructions " +
                        "(id, apartment_id, title, description, images, pdf_files, instruction_text, important_notes, contact_info, wifi_info, parking_info, house_rules, created_at, updated_at) " +
                        "VALUES ('" + instruction_id + "', '" + apartment_id + "', '" + title.replace("'", "''") + "', '" + 
                        description.replace("'", "''") + "', " + images_array + ", " + pdf_array + ", '" + instruction_text.replace("'", "''") + "', '" + 
                        important_notes.replace("'", "''") + "', '" + contact_info.replace("'", "''") + "', '" + wifi_info.replace("'", "''") + "', '" + 
                        parking_info.replace("'", "''") + "', '" + house_rules.replace("'", "''") + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'id': instruction_id,
                        'message': 'Инструкция успешно сохранена'
                    })
                }
        
        elif method == 'DELETE':
            # Удаление инструкции
            params = event.get('queryStringParameters') or {}
            instruction_id = params.get('id')
            
            if not instruction_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'ID инструкции не указан'})
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM check_in_instructions WHERE id = '" + instruction_id + "'"
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Инструкция удалена'
                    })
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
        
    finally:
        conn.close()