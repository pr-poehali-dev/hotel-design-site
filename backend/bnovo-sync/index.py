import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse

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
    
    # Получаем credentials из секретов (это логин и пароль от Bnovo)
    login = os.environ.get('BNOVO_API_KEY', '111392')  # ID аккаунта используется как логин
    password = os.environ.get('BNOVO_API_PASSWORD', '')
    
    try:
        # Шаг 1: Авторизация и получение JWT токена
        auth_url = 'https://online.bnovo.ru/api/v1/auth'
        auth_payload = {
            'login': login,
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
        
        # Извлекаем JWT токен
        jwt_token = auth_data.get('token') or auth_data.get('access_token')
        
        if not jwt_token:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to get JWT token',
                    'auth_response': auth_data
                })
            }
        
        # Шаг 2: Получаем список бронирований с JWT токеном
        bookings_url = 'https://online.bnovo.ru/api/v1/bookings'
        
        bookings_request = urllib.request.Request(
            bookings_url,
            headers={
                'Authorization': f'Bearer {jwt_token}',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        )
        
        with urllib.request.urlopen(bookings_request, timeout=30) as bookings_response:
            bookings_data = json.loads(bookings_response.read().decode())
        
        # Извлекаем список бронирований
        if isinstance(bookings_data, dict):
            bookings_list = bookings_data.get('data', bookings_data.get('bookings', []))
        elif isinstance(bookings_data, list):
            bookings_list = bookings_data
        else:
            bookings_list = []
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'total_from_bnovo': len(bookings_list),
                'sample_bookings': bookings_list[:3] if bookings_list else [],
                'message': 'Successfully connected to Bnovo API'
            }, ensure_ascii=False)
        }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='ignore') if e.fp else str(e)
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': f'HTTP {e.code}',
                'details': error_body[:500]  # Первые 500 символов ошибки
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
