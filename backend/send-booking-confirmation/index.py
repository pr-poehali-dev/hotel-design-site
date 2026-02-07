'''
Business: Send booking confirmation email to guest
Args: event with guest_email, guest_name, apartment_id, check_in, check_out, total_amount, guest_comment
Returns: Success/error response
'''

import json
import os
import smtplib
from email.mime.text import MIMEText

# Force redeploy
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    guest_email = body_data.get('guest_email')
    guest_name = body_data.get('guest_name', 'Гость')
    apartment_id = body_data.get('apartment_id')
    check_in = body_data.get('check_in')
    check_out = body_data.get('check_out')
    total_amount = body_data.get('total_amount', '0')
    guests_count = body_data.get('guests_count', '1')
    guest_comment = body_data.get('guest_comment', '')
    guest_login = body_data.get('guest_login', '')
    guest_password = body_data.get('guest_password', '')
    
    if not guest_email or not apartment_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Подтверждение бронирования апартаментов Поклонная 9 - {apartment_id}'
    msg['From'] = smtp_user
    msg['To'] = guest_email
    
    html_body = f'''
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #C9A961; text-align: center;">Спасибо за бронирование!</h2>
          
          <p>Здравствуйте, <strong>{guest_name}</strong>!</p>
          
          <p>Ваша заявка на бронирование апартаментов <strong>Поклонная 9</strong> принята.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #C9A961; margin-top: 0;">Детали бронирования:</h3>
            <p><strong>Апартамент:</strong> {apartment_id}</p>
            <p><strong>Заезд:</strong> {check_in} с 15:00</p>
            <p><strong>Выезд:</strong> {check_out} до 12:00</p>
            <p><strong>Количество гостей:</strong> {guests_count}</p>
            <p><strong>Стоимость:</strong> {total_amount} ₽</p>
          </div>
          
          {f'<div style="background-color: #fff9e6; padding: 15px; border-left: 4px solid #C9A961; margin: 20px 0;"><h4 style="margin-top: 0; color: #C9A961;">Важная информация о заселении:</h4><p>{guest_comment}</p></div>' if guest_comment else ''}
          
          {f'<div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #C9A961;"><h3 style="color: #C9A961; margin-top: 0;">Доступ в личный кабинет</h3><p>Для вас создан личный кабинет, где вы можете отслеживать свои бронирования и бонусные баллы:</p><div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;"><p style="margin: 5px 0;"><strong>Логин:</strong> ' + guest_login + '</p><p style="margin: 5px 0;"><strong>Пароль:</strong> ' + guest_password + '</p></div><p style="margin-top: 15px;"><a href="https://poklonnaya9.ru/guest-login" style="display: inline-block; padding: 12px 24px; background-color: #C9A961; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Войти в личный кабинет</a></p></div>' if guest_login and guest_password else ''}
          
          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>✅ Администратор свяжется с вами для подтверждения бронирования в ближайшее время!</strong></p>
          </div>
          
          <div style="border-top: 2px solid #C9A961; padding-top: 15px; margin-top: 20px;">
            <p style="margin: 5px 0;">📞 <strong>Для срочных вопросов или пожеланий:</strong></p>
            <p style="margin: 5px 0; font-size: 18px;"><a href="tel:+79141965172" style="color: #C9A961; text-decoration: none;">+7 914 196-51-72</a></p>
          </div>
          
          <p style="margin-top: 30px; text-align: center; color: #888; font-size: 12px;">
            С уважением,<br>
            Команда <strong>Поклонная 9</strong>
          </p>
        </div>
      </body>
    </html>
    '''
    
    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)
    
    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'success': False, 'error': str(e)})
        }