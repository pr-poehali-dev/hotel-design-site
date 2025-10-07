import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка email с инструкциями по заселению гостю
    Args: event - dict с httpMethod, body (guest_email, guest_name, booking_id, apartment_id)
          context - object с request_id
    Returns: HTTP response dict
    Version: 1.1 - обновлена конфигурация SMTP
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
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
    guest_email = body_data.get('guest_email')
    guest_name = body_data.get('guest_name', 'Гость')
    booking_id = body_data.get('booking_id')
    apartment_id = body_data.get('apartment_id')
    
    if not guest_email or not booking_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields: guest_email, booking_id'}),
            'isBase64Encoded': False
        }
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email configuration not set'}),
            'isBase64Encoded': False
        }
    
    guest_dashboard_url = f"https://your-domain.com/guest-dashboard?booking={booking_id}"
    
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
            .button {{ display: inline-block; background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }}
            .info-box {{ background: white; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Добро пожаловать!</h1>
                <p>Поклонная 9 - Премиум апартаменты</p>
            </div>
            <div class="content">
                <p>Здравствуйте, {guest_name}!</p>
                
                <p>Мы рады приветствовать вас в наших апартаментах. Ваше бронирование успешно подтверждено!</p>
                
                <div class="info-box">
                    <strong>Номер бронирования:</strong> {booking_id}<br>
                    <strong>Апартамент:</strong> {apartment_id}
                </div>
                
                <p>Для вашего удобства мы подготовили личный кабинет, где вы найдете:</p>
                <ul>
                    <li>📸 Фотографии вашего апартамента</li>
                    <li>📍 Подробную инструкцию по заселению</li>
                    <li>🔑 Информацию о получении ключей</li>
                    <li>📶 Wi-Fi пароль</li>
                    <li>🚗 Информацию о парковке</li>
                    <li>📞 Контакты для связи</li>
                </ul>
                
                <center>
                    <a href="{guest_dashboard_url}" class="button">Открыть личный кабинет</a>
                </center>
                
                <div class="info-box">
                    <strong>Важно:</strong> Сохраните эту ссылку - она понадобится вам для доступа к инструкциям и информации о бронировании.
                </div>
                
                <p>Если у вас возникнут вопросы, мы всегда на связи!</p>
                
                <p>С уважением,<br>Команда Поклонная 9</p>
            </div>
            <div class="footer">
                <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Добро пожаловать! Бронирование #{booking_id}'
    msg['From'] = smtp_user
    msg['To'] = guest_email
    
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Email sent to {guest_email}',
                'dashboard_url': guest_dashboard_url
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': False,
                'error': f'Failed to send email: {str(e)}'
            }),
            'isBase64Encoded': False
        }