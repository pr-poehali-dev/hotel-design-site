import json
import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка уведомлений владельцу о новом бронировании (Email + Telegram)
    Args: event - dict с httpMethod, body (booking_details)
          context - object с request_id
    Returns: HTTP response dict
    '''
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    booking_id = body_data.get('booking_id')
    guest_name = body_data.get('guest_name')
    guest_email = body_data.get('guest_email')
    guest_phone = body_data.get('guest_phone')
    apartment_id = body_data.get('apartment_id')
    apartment_name = body_data.get('apartment_name', apartment_id)
    check_in = body_data.get('check_in')
    check_out = body_data.get('check_out')
    total_amount = body_data.get('total_amount', 0)
    
    if not all([booking_id, guest_name, apartment_id, check_in, check_out]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    results = {'email': None, 'telegram': None}
    
    owner_email = os.environ.get('OWNER_EMAIL')
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if owner_email and smtp_host and smtp_user and smtp_password:
        try:
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .info-box {{ background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }}
                    .row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                    .label {{ font-weight: bold; color: #666; }}
                    .value {{ color: #333; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Новое бронирование!</h1>
                    </div>
                    <div class="content">
                        <h2>Детали бронирования:</h2>
                        <div class="info-box">
                            <div class="row">
                                <span class="label">ID брони:</span>
                                <span class="value">{booking_id}</span>
                            </div>
                            <div class="row">
                                <span class="label">Апартамент:</span>
                                <span class="value">{apartment_name}</span>
                            </div>
                            <div class="row">
                                <span class="label">Заезд:</span>
                                <span class="value">{check_in}</span>
                            </div>
                            <div class="row">
                                <span class="label">Выезд:</span>
                                <span class="value">{check_out}</span>
                            </div>
                            <div class="row">
                                <span class="label">Сумма:</span>
                                <span class="value">{total_amount} ₽</span>
                            </div>
                        </div>
                        
                        <h3>Контакты гостя:</h3>
                        <div class="info-box">
                            <div class="row">
                                <span class="label">Имя:</span>
                                <span class="value">{guest_name}</span>
                            </div>
                            <div class="row">
                                <span class="label">Email:</span>
                                <span class="value">{guest_email}</span>
                            </div>
                            <div class="row">
                                <span class="label">Телефон:</span>
                                <span class="value">{guest_phone}</span>
                            </div>
                        </div>
                        
                        <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                            <strong>⚠️ Действие:</strong> Добавьте это бронирование в Bnovo вручную
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'Новое бронирование: {guest_name} | {check_in} - {check_out}'
            msg['From'] = smtp_user
            msg['To'] = owner_email
            
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
            
            results['email'] = 'sent'
        except Exception as e:
            results['email'] = f'failed: {str(e)}'
    
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if telegram_bot_token and telegram_chat_id:
        try:
            telegram_message = f"""🎉 <b>Новое бронирование!</b>

📋 <b>ID брони:</b> <code>{booking_id}</code>
🏠 <b>Апартамент:</b> {apartment_name}
📅 <b>Заезд:</b> {check_in}
📅 <b>Выезд:</b> {check_out}
💰 <b>Сумма:</b> {total_amount} ₽

👤 <b>Гость:</b> {guest_name}
📧 <b>Email:</b> {guest_email}
📱 <b>Телефон:</b> {guest_phone}

⚠️ <b>Не забудьте добавить в Bnovo!</b>"""
            
            telegram_url = f'https://api.telegram.org/bot{telegram_bot_token}/sendMessage'
            telegram_payload = {
                'chat_id': telegram_chat_id,
                'text': telegram_message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(telegram_url, json=telegram_payload, timeout=10)
            
            if response.status_code == 200:
                results['telegram'] = 'sent'
            else:
                results['telegram'] = f'failed: {response.text}'
        except Exception as e:
            results['telegram'] = f'failed: {str(e)}'
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'results': results
        }),
        'isBase64Encoded': False
    }
