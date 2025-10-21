import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправка письма гостю с подтверждением бронирования
    Args: event - dict с httpMethod, body (guest_email, booking details)
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
    
    guest_email = body_data.get('guest_email')
    guest_name = body_data.get('guest_name')
    booking_id = body_data.get('booking_id')
    apartment_name = body_data.get('apartment_name', 'Апартамент')
    check_in = body_data.get('check_in')
    check_out = body_data.get('check_out')
    total_amount = body_data.get('total_amount', 0)
    guest_phone = body_data.get('guest_phone', '')
    
    if not all([guest_email, guest_name, booking_id, check_in, check_out]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
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
            'body': json.dumps({'error': 'Email service not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        check_in_date = datetime.strptime(check_in, '%Y-%m-%d')
        check_out_date = datetime.strptime(check_out, '%Y-%m-%d')
        nights = (check_out_date - check_in_date).days
        
        check_in_formatted = check_in_date.strftime('%d.%m.%Y')
        check_out_formatted = check_out_date.strftime('%d.%m.%Y')
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: white; padding: 40px 30px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 28px; font-weight: 600; }}
                .header p {{ margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }}
                .content {{ padding: 40px 30px; }}
                .greeting {{ font-size: 18px; color: #333; margin-bottom: 20px; }}
                .info-section {{ background: #f9f9f9; border-radius: 8px; padding: 25px; margin: 25px 0; }}
                .info-section h2 {{ margin: 0 0 20px 0; font-size: 20px; color: #D4AF37; }}
                .info-row {{ display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e5e5; }}
                .info-row:last-child {{ border-bottom: none; }}
                .info-label {{ font-weight: 600; color: #666; }}
                .info-value {{ color: #333; text-align: right; }}
                .highlight-box {{ background: #fff8e1; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 4px; }}
                .highlight-box strong {{ color: #C5A028; }}
                .contact-info {{ background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 25px 0; }}
                .contact-info p {{ margin: 8px 0; }}
                .footer {{ background: #f9f9f9; padding: 25px 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e5e5; }}
                .footer a {{ color: #D4AF37; text-decoration: none; }}
                .total-amount {{ font-size: 24px; font-weight: bold; color: #D4AF37; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Бронирование подтверждено!</h1>
                    <p>Ваша заявка успешно принята</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Здравствуйте, <strong>{guest_name}</strong>!
                    </div>
                    
                    <p>Спасибо за бронирование! Мы рады приветствовать вас в наших апартаментах.</p>
                    
                    <div class="info-section">
                        <h2>📋 Детали бронирования</h2>
                        <div class="info-row">
                            <span class="info-label">Номер брони:</span>
                            <span class="info-value"><strong>{booking_id}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Апартамент:</span>
                            <span class="info-value">{apartment_name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Дата заезда:</span>
                            <span class="info-value">{check_in_formatted} (после 14:00)</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Дата выезда:</span>
                            <span class="info-value">{check_out_formatted} (до 12:00)</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Количество ночей:</span>
                            <span class="info-value">{nights}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Сумма к оплате:</span>
                            <span class="info-value total-amount">{total_amount:,.0f} ₽</span>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <strong>⏰ Важная информация:</strong>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li>Заезд: с 14:00</li>
                            <li>Выезд: до 12:00</li>
                            <li>При заезде необходим паспорт</li>
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <p><strong>📞 Остались вопросы?</strong></p>
                        <p>Свяжитесь с нами:</p>
                        <p>📧 Email: poklonapart@mail.ru</p>
                        <p>📱 Телефон: +7 (XXX) XXX-XX-XX</p>
                    </div>
                    
                    <p style="margin-top: 30px; color: #666;">
                        Ждем вас! Мы сделаем всё возможное, чтобы ваше пребывание было комфортным.
                    </p>
                </div>
                
                <div class="footer">
                    <p>С уважением, команда PoklonApart</p>
                    <p style="margin-top: 15px;">
                        <a href="https://poklonapart.ru">poklonapart.ru</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Подтверждение бронирования #{booking_id} | {check_in_formatted} - {check_out_formatted}'
        msg['From'] = f'PoklonApart <{smtp_user}>'
        msg['To'] = guest_email
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': 'Confirmation email sent to guest'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to send email: {str(e)}'}),
            'isBase64Encoded': False
        }
