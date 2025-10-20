import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import base64

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Синхронизация бронирований из Bnovo API в локальную базу данных
    Args: event - dict с httpMethod
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с результатом синхронизации
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
    
    # Получаем credentials из секретов
    account_id = os.environ.get('BNOVO_API_KEY', '111392')
    api_password = os.environ.get('BNOVO_API_PASSWORD', 'UHZ6V1B3bzRoZzdSbzN0R1BmbHA4eXVxSUZUcjFaZkVobW1tb0lCcitsZz18YjRiZTNhNzVmOTVhZmMwY2Y5MDQ2NDk0ZjBiNTgyY2Q=')
    
    try:
        # Используем прямой доступ по API (без JWT, через Account ID + пароль)
        # Формируем URL с учётными данными
        bookings_url = f'https://online.bnovo.ru/{account_id}/api/bookings?password={urllib.parse.quote(api_password)}'
        
        bookings_request = urllib.request.Request(
            bookings_url,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(bookings_request, timeout=30) as response:
            bnovo_data = json.loads(response.read().decode())
        
        # Проверяем формат ответа
        if isinstance(bnovo_data, dict):
            bookings_list = bnovo_data.get('data', bnovo_data.get('bookings', []))
        elif isinstance(bnovo_data, list):
            bookings_list = bnovo_data
        else:
            bookings_list = []
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'total_from_bnovo': len(bookings_list),
                'sample': bookings_list[:3] if bookings_list else [],
                'message': 'Bnovo API connection successful'
            })
        }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else str(e)
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': f'HTTP Error {e.code}: {error_body}'
            })
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