import json
import os
from typing import Dict, Any
import urllib.request
import urllib.parse
import urllib.error
import base64
from datetime import datetime, timedelta

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
    
    account_id = os.environ.get('BNOVO_ACCOUNT_ID', '')
    password = os.environ.get('BNOVO_PASSWORD', '')
    
    # Кодируем логин:пароль в Base64 для Basic Auth
    credentials = f'{account_id}:{password}'
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    try:
        # Правильный API endpoint: https://api.pms.bnovo.ru
        # Сначала авторизуемся и получаем JWT токен
        auth_url = 'https://api.pms.bnovo.ru/api/v1/auth'
        auth_payload = {
            'id': int(account_id),
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
        
        # Получаем JWT токен из data.access_token
        jwt_token = auth_data.get('data', {}).get('access_token') or auth_data.get('access_token') or auth_data.get('token')
        
        if not jwt_token:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': False,
                    'error': 'JWT token not found in response',
                    'auth_response': auth_data
                })
            }
        
        # Теперь получаем бронирования с JWT токеном
        # Добавляем обязательные параметры: date_from, date_to, limit, offset
        # Получаем бронирования за последние 30 дней и следующие 90 дней
        # Bnovo использует формат даты Y-m-d (например, 2025-06-25)
        date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        date_to = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d')
        
        # Формируем URL с параметрами (limit max 20)
        params = urllib.parse.urlencode({
            'date_from': date_from,
            'date_to': date_to,
            'limit': 20,
            'offset': 0
        })
        url = f'https://api.pms.bnovo.ru/api/v1/bookings?{params}'
        
        request_obj = urllib.request.Request(
            url,
            headers={
                'Authorization': f'Bearer {jwt_token}',
                'Accept': 'application/json'
            }
        )
        
        with urllib.request.urlopen(request_obj, timeout=30) as response:
            data = json.loads(response.read().decode())
        
        # Получаем список комнат (апартаментов)
        rooms_url = 'https://api.pms.bnovo.ru/api/v1/rooms'
        rooms_request = urllib.request.Request(
            rooms_url,
            headers={
                'Authorization': f'Bearer {jwt_token}',
                'Accept': 'application/json'
            }
        )
        
        rooms_data = {}
        try:
            with urllib.request.urlopen(rooms_request, timeout=30) as rooms_response:
                rooms_data = json.loads(rooms_response.read().decode())
        except Exception as rooms_error:
            rooms_data = {'error': str(rooms_error)}
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': 'Successfully connected to Bnovo',
                'bookings': data.get('data', []) if isinstance(data, dict) else data,
                'total_bookings': len(data.get('data', [])) if isinstance(data, dict) else len(data),
                'rooms': rooms_data.get('data', []) if isinstance(rooms_data, dict) else rooms_data
            }, ensure_ascii=False)
        }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='ignore') if e.fp else ''
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'http_code': e.code,
                'url_tested': e.url if hasattr(e, 'url') else 'https://api.pms.bnovo.ru',
                'error_details': error_body[:1000]
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
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
                'url_tested': 'https://api.pms.bnovo.ru/v2/auth/login'
            })
        }