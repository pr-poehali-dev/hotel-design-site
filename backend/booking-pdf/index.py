'''
Business: Generate booking confirmation PDF for guests
Args: event with httpMethod (POST), body with booking_id, guest_email
Returns: HTTP response with PDF file in base64 or error
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
import base64
from io import BytesIO
import psycopg2
from psycopg2.extras import RealDictCursor

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.units import mm
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
except ImportError:
    pass

def get_db_connection():
    """Get database connection"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not set')
    return psycopg2.connect(dsn)

def format_date(date_str: str) -> str:
    """Format date to Russian format"""
    months = {
        1: 'января', 2: 'февраля', 3: 'марта', 4: 'апреля',
        5: 'мая', 6: 'июня', 7: 'июля', 8: 'августа',
        9: 'сентября', 10: 'октября', 11: 'ноября', 12: 'декабря'
    }
    date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    return f"{date.day} {months[date.month]} {date.year}"

def generate_booking_pdf(booking: Dict[str, Any]) -> bytes:
    """Generate PDF for booking confirmation"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4, 
        topMargin=20*mm, 
        bottomMargin=20*mm,
        leftMargin=20*mm,
        rightMargin=20*mm
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#d4af37'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#34495e'),
        fontName='Helvetica'
    )
    
    story.append(Paragraph("P9 PREMIUM APARTMENTS", title_style))
    story.append(Spacer(1, 10*mm))
    
    story.append(Paragraph("ПОДТВЕРЖДЕНИЕ БРОНИРОВАНИЯ", heading_style))
    story.append(Spacer(1, 5*mm))
    
    booking_data = [
        ['Номер бронирования:', booking['id']],
        ['Апартамент:', f"№ {booking['apartment_id']}"],
        ['Гость:', booking['guest_name']],
        ['Email:', booking['guest_email']],
        ['Телефон:', booking['guest_phone'] or '—'],
    ]
    
    booking_table = Table(booking_data, colWidths=[60*mm, 100*mm])
    booking_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 10),
        ('FONT', (1, 0), (1, -1), 'Helvetica', 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2c3e50')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0')),
    ]))
    
    story.append(booking_table)
    story.append(Spacer(1, 8*mm))
    
    story.append(Paragraph("ДАТЫ ПРОЖИВАНИЯ", heading_style))
    story.append(Spacer(1, 3*mm))
    
    dates_data = [
        ['Заезд:', format_date(booking['check_in']), 'с 14:00'],
        ['Выезд:', format_date(booking['check_out']), 'до 12:00'],
    ]
    
    dates_table = Table(dates_data, colWidths=[40*mm, 80*mm, 40*mm])
    dates_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 10),
        ('FONT', (1, 0), (-1, -1), 'Helvetica', 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2c3e50')),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e0e0e0')),
    ]))
    
    story.append(dates_table)
    story.append(Spacer(1, 8*mm))
    
    if booking.get('total_amount'):
        story.append(Paragraph("СТОИМОСТЬ", heading_style))
        story.append(Spacer(1, 3*mm))
        
        cost_data = []
        
        if booking.get('early_check_in') and booking['early_check_in'] > 0:
            cost_data.append(['Ранний заезд', f"{float(booking['early_check_in']):,.0f} ₽"])
        
        if booking.get('late_check_out') and booking['late_check_out'] > 0:
            cost_data.append(['Поздний выезд', f"{float(booking['late_check_out']):,.0f} ₽"])
        
        if booking.get('parking') and booking['parking'] > 0:
            cost_data.append(['Парковка', f"{float(booking['parking']):,.0f} ₽"])
        
        cost_data.append(['', ''])
        cost_data.append(['ИТОГО:', f"{float(booking['total_amount']):,.0f} ₽"])
        
        cost_table = Table(cost_data, colWidths=[120*mm, 40*mm])
        cost_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('FONT', (0, 0), (0, -2), 'Helvetica', 10),
            ('FONT', (1, 0), (1, -2), 'Helvetica', 10),
            ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold', 12),
            ('TEXTCOLOR', (0, 0), (-1, -2), colors.HexColor('#2c3e50')),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#d4af37')),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#d4af37')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(cost_table)
        story.append(Spacer(1, 8*mm))
    
    story.append(Paragraph("ВАЖНАЯ ИНФОРМАЦИЯ", heading_style))
    story.append(Spacer(1, 3*mm))
    
    info_text = """
    • Заезд: с 14:00<br/>
    • Выезд: до 12:00<br/>
    • При заселении необходим документ, удостоверяющий личность<br/>
    • Инструкции по заселению доступны в вашем личном кабинете<br/>
    • По всем вопросам обращайтесь в службу поддержки
    """
    
    story.append(Paragraph(info_text, normal_style))
    story.append(Spacer(1, 15*mm))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#7f8c8d'),
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    footer_text = f"""
    Документ сгенерирован {datetime.now().strftime('%d.%m.%Y в %H:%M')}<br/>
    P9 Premium Apartments | p9apart.ru
    """
    
    story.append(Paragraph(footer_text, footer_style))
    
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email',
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
    
    body = event.get('body', '{}')
    if not body or body.strip() == '':
        body = '{}'
    
    try:
        body_data = json.loads(body)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Неверный формат JSON'})
        }
    
    booking_id = body_data.get('booking_id')
    guest_email = body_data.get('guest_email', '').lower().strip()
    
    if not booking_id or not guest_email:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'booking_id и guest_email обязательны'})
        }
    
    try:
        
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            """
            SELECT 
                id, apartment_id, check_in, check_out,
                guest_name, guest_email, guest_phone,
                total_amount, early_check_in, late_check_out, parking
            FROM t_p9202093_hotel_design_site.bookings 
            WHERE id = %s AND LOWER(guest_email) = %s
            """,
            (booking_id, guest_email)
        )
        
        booking = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not booking:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Бронирование не найдено'})
            }
        
        booking_dict = dict(booking)
        
        if booking_dict.get('check_in'):
            booking_dict['check_in'] = booking_dict['check_in'].isoformat()
        if booking_dict.get('check_out'):
            booking_dict['check_out'] = booking_dict['check_out'].isoformat()
        
        pdf_bytes = generate_booking_pdf(booking_dict)
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'pdf': pdf_base64,
                'filename': f'booking_{booking_id}.pdf'
            })
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