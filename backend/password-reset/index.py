'''
Business: Password reset API - send reset email and verify reset token
Args: event with httpMethod (POST), body with action, email, token, new_password
Returns: HTTP response with success/error message
'''

import json
import os
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    """Generate secure random token"""
    return secrets.token_urlsafe(32)

def get_db_connection():
    """Get database connection"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    return psycopg2.connect(dsn)

def send_reset_email(email: str, token: str) -> bool:
    """Send password reset email"""
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        raise ValueError('SMTP settings not configured')
    
    reset_link = f"https://p9apart.ru/guest-reset-password?token={token}"
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Восстановление пароля - P9 Premium Apartments'
    msg['From'] = smtp_user
    msg['To'] = email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #d4af37, #f4d03f); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">P9 Premium Apartments</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #d4af37; margin-top: 0;">Восстановление пароля</h2>
            
            <p>Здравствуйте!</p>
            
            <p>Мы получили запрос на восстановление пароля для вашего аккаунта в личном кабинете гостя.</p>
            
            <p>Для сброса пароля нажмите на кнопку ниже:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{reset_link}" 
                 style="background: linear-gradient(to right, #d4af37, #f4d03f); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;">
                Восстановить пароль
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Или скопируйте эту ссылку в браузер:<br>
              <a href="{reset_link}" style="color: #d4af37;">{reset_link}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
              ⏰ Ссылка действительна в течение 1 часа.<br>
              Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
            </p>
          </div>
        </div>
      </body>
    </html>
    """
    
    text = f"""
    P9 Premium Apartments
    
    Восстановление пароля
    
    Здравствуйте!
    
    Мы получили запрос на восстановление пароля для вашего аккаунта.
    
    Для сброса пароля перейдите по ссылке:
    {reset_link}
    
    Ссылка действительна в течение 1 часа.
    
    Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
    """
    
    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html, 'html'))
    
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.send_message(msg)
    server.quit()
    
    return True

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'request_reset':
            email = body_data.get('email', '').lower().strip()
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Email обязателен'})
                }
            
            cursor.execute(
                "SELECT id FROM t_p9202093_hotel_design_site.guest_users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            
            if not user:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Если этот email зарегистрирован, на него отправлена инструкция'
                    })
                }
            
            token = generate_token()
            expires_at = datetime.now() + timedelta(hours=1)
            
            cursor.execute(
                """
                INSERT INTO t_p9202093_hotel_design_site.password_reset_tokens 
                (guest_user_id, token, expires_at) 
                VALUES (%s, %s, %s)
                """,
                (user['id'], token, expires_at)
            )
            conn.commit()
            
            try:
                send_reset_email(email, token)
            except Exception as e:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': f'Ошибка отправки email: {str(e)}'})
                }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Инструкция по восстановлению пароля отправлена на email'
                })
            }
        
        elif action == 'reset_password':
            token = body_data.get('token', '')
            new_password = body_data.get('new_password', '')
            
            if not token or not new_password:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Токен и новый пароль обязательны'})
                }
            
            if len(new_password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'})
                }
            
            cursor.execute(
                """
                SELECT guest_user_id, expires_at, used 
                FROM t_p9202093_hotel_design_site.password_reset_tokens 
                WHERE token = %s
                """,
                (token,)
            )
            reset_token = cursor.fetchone()
            
            if not reset_token:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Неверный токен'})
                }
            
            if reset_token['used']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Токен уже использован'})
                }
            
            if datetime.now() > reset_token['expires_at']:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Токен истёк. Запросите новый'})
                }
            
            password_hash = hash_password(new_password)
            
            cursor.execute(
                """
                UPDATE t_p9202093_hotel_design_site.guest_users 
                SET password_hash = %s, updated_at = CURRENT_TIMESTAMP 
                WHERE id = %s
                """,
                (password_hash, reset_token['guest_user_id'])
            )
            
            cursor.execute(
                """
                UPDATE t_p9202093_hotel_design_site.password_reset_tokens 
                SET used = TRUE 
                WHERE token = %s
                """,
                (token,)
            )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Пароль успешно изменён'
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неизвестное действие'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
