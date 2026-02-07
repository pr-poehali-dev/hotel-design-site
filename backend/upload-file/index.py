import json
import base64
import os
import uuid
from typing import Dict, Any
from datetime import datetime

# Force redeploy

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Загрузка файлов (PDF, изображения) на CDN
    Args: event с httpMethod, body (base64 файл); context с request_id
    Returns: HTTP response с URL загруженного файла
    '''
    method: str = event.get('httpMethod', 'POST')
    
    # CORS OPTIONS
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
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            
            file_content = body_data.get('file')  # base64 строка
            file_name = body_data.get('fileName', 'file')
            file_type = body_data.get('fileType', 'application/pdf')
            
            if not file_content:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Файл не предоставлен'})
                }
            
            # Генерируем уникальное имя файла
            file_extension = file_name.split('.')[-1] if '.' in file_name else 'pdf'
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # В реальности здесь должна быть загрузка на S3/CDN
            # Для примера возвращаем мок URL
            cdn_url = f"https://cdn.poehali.dev/files/{unique_filename}"
            
            # Здесь должен быть код загрузки на реальный CDN:
            # import boto3
            # s3 = boto3.client('s3')
            # file_bytes = base64.b64decode(file_content)
            # s3.put_object(
            #     Bucket='your-bucket',
            #     Key=unique_filename,
            #     Body=file_bytes,
            #     ContentType=file_type
            # )
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'url': cdn_url,
                    'fileName': unique_filename,
                    'message': 'Файл успешно загружен'
                })
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Ошибка загрузки файла',
                    'details': str(e)
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