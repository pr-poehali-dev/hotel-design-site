import json
import os
from typing import Dict, Any
import urllib.request
import base64

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Тестирование подключения к Bnovo API и получение бронирований
    Args: event - dict с httpMethod
          context - объект с атрибутами request_id
    Returns: HTTP response с результатом теста
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
    
    account_id = os.environ.get('BNOVO_API_KEY', '111392')
    password = os.environ.get('BNOVO_API_PASSWORD', '')
    
    # Кодируем логин:пароль в Base64 для Basic Auth
    credentials = f'{account_id}:{password}'
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    try:
        # Согласно документации Bnovo: GET https://online.bnovo.ru/{ACCOUNT_ID}/bookings
        # с Basic Auth заголовком
        url = f'https://online.bnovo.ru/{account_id}/bookings'
        
        request_obj = urllib.request.Request(
            url,
            headers={
                'Authorization': f'Basic {encoded_credentials}',
                'Accept': 'application/json'
            }
        )
        
        with urllib.request.urlopen(request_obj, timeout=30) as response:
            data = json.loads(response.read().decode())
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': 'Successfully connected to Bnovo',
                'total_bookings': len(data) if isinstance(data, list) else len(data.get('data', [])),
                'sample': data[:2] if isinstance(data, list) else data.get('data', [])[:2]
            }, ensure_ascii=False)
        }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='ignore') if e.fp else ''
        return {
            'statusCode': 200,  # Возвращаем 200 чтобы увидеть детали ошибки
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'http_code': e.code,
                'url_tested': url,
                'error_details': error_body[:1000]
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 200,  # Возвращаем 200 чтобы увидеть детали ошибки
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__,
                'url_tested': f'https://online.bnovo.ru/{account_id}/bookings'
            })
        }