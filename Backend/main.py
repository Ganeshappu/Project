from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.message import EmailMessage
from email import encoders
import os
import random
import time
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Email Service API with OTP", version="1.0.0")

# CORS middleware to allow React app to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Add this for Vite frontend
        "http://localhost:3000",  # React default
        "http://127.0.0.1:3000", # React alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OTP Storage
OTP_STORE = {}  # key: email, value: (otp, expiry_timestamp)

# Pydantic models for request/response
class EmailRequest(BaseModel):
    to: List[EmailStr]
    subject: str
    body: str
    html_body: Optional[str] = None
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None

class EmailResponse(BaseModel):
    success: bool
    message: str
    email_id: Optional[str] = None

class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class OTPResponse(BaseModel):
    message: str
    token: Optional[str] = None

# Email configuration
EMAIL_CONFIG = {
    "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    "smtp_port": int(os.getenv("SMTP_PORT", 587)),
    "email": os.getenv("EMAIL_ADDRESS") or os.getenv("EMAIL_USER"),
    "password": os.getenv("EMAIL_PASSWORD") or os.getenv("EMAIL_PASS"),
}

# Admin email for OTP
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

# HTML Email Templates
def get_base_template():
    """Base HTML template for all emails"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }}
            
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            
            .header h1 {{
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 300;
            }}
            
            .header p {{
                font-size: 16px;
                opacity: 0.9;
            }}
            
            .content {{
                padding: 40px 30px;
            }}
            
            .footer {{
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }}
            
            .footer p {{
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 10px;
            }}
            
            .btn {{
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 500;
                transition: all 0.3s ease;
                margin: 15px 0;
            }}
            
            .btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }}
            
            .otp-box {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }}
            
            .otp-code {{
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 15px 0;
                font-family: 'Courier New', monospace;
            }}
            
            .warning-box {{
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }}
            
            .success-box {{
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #155724;
            }}
            
            .info-box {{
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #0c5460;
            }}
            
            .attendance-card {{
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }}
            
            .attendance-status {{
                display: inline-block;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 500;
                text-transform: uppercase;
                font-size: 12px;
                margin: 10px 0;
            }}
            
            .status-present {{
                background-color: #d4edda;
                color: #155724;
            }}
            
            .status-absent {{
                background-color: #f8d7da;
                color: #721c24;
            }}
            
            .contact-info {{
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }}
            
            .contact-info h3 {{
                color: #667eea;
                margin-bottom: 15px;
            }}
            
            .contact-info p {{
                margin-bottom: 8px;
            }}
            
            .divider {{
                height: 1px;
                background: linear-gradient(to right, transparent, #667eea, transparent);
                margin: 30px 0;
            }}
            
            @media (max-width: 600px) {{
                .container {{
                    margin: 0 10px;
                }}
                
                .header {{
                    padding: 20px;
                }}
                
                .content {{
                    padding: 20px;
                }}
                
                .otp-code {{
                    font-size: 24px;
                    letter-spacing: 4px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            {content}
        </div>
    </body>
    </html>
    """

def get_otp_email_template(otp: str, user_name: str = "User"):
    """OTP email template"""
    current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    content = f"""
    <div class="header">
        <h1>🔐 Admin Login Verification</h1>
        <p>Your One-Time Password (OTP) for secure access</p>
    </div>
    
    <div class="content">
        <h2>Hello {user_name}! 👋</h2>
        <p>We received a request to access your admin account. Please use the following OTP to complete your login:</p>
        
        <div class="otp-box">
            <p style="margin: 0; font-size: 16px;">Your OTP Code is:</p>
            <div class="otp-code">{otp}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Valid for 5 minutes</p>
        </div>
        
        <div class="warning-box">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0 0 20px;">
                <li>This OTP is valid for only 5 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
            </ul>
        </div>
        
        <div class="info-box">
            <p><strong>📅 Request Time:</strong> {current_time}</p>
            <p><strong>🔒 Security Level:</strong> High</p>
        </div>
        
        <div class="divider"></div>
        
        <p>If you have any concerns about this login attempt, please contact our support team immediately.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
    </div>
    """
    
    return get_base_template().format(
        title="Admin Login OTP",
        content=content
    )

def get_contact_form_template(name: str, email: str, subject: str, message: str):
    """Contact form submission template"""
    current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    content = f"""
    <div class="header">
        <h1>📨 New Contact Form Submission</h1>
        <p>Someone has reached out through your website</p>
    </div>
    
    <div class="content">
        <h2>New Message Received! 📬</h2>
        <p>You have received a new message through your contact form:</p>
        
        <div class="contact-info">
            <h3>👤 Contact Information</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}" style="color: #667eea; text-decoration: none;">{email}</a></p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Submitted:</strong> {current_time}</p>
        </div>
        
        <div class="divider"></div>
        
        <h3>💬 Message Content</h3>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 15px 0;">
            <p style="white-space: pre-wrap; margin: 0;">{message}</p>
        </div>
        
        <div class="success-box">
            <p><strong>✅ Next Steps:</strong> The sender expects a response. Please reply within 24-48 hours for best customer service.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:{email}" class="btn">Reply to {name}</a>
        </div>
    </div>
    
    <div class="footer">
        <p>This message was sent through your website contact form.</p>
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
    </div>
    """
    
    return get_base_template().format(
        title="New Contact Form Submission",
        content=content
    )

def get_attendance_email_template(student_name: str, subject: str, date: str, period: str, status: str):
    """Attendance notification template"""
    current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    status_class = "status-present" if status.lower() == "present" else "status-absent"
    status_emoji = "✅" if status.lower() == "present" else "❌"
    status_color = "#28a745" if status.lower() == "present" else "#dc3545"
    
    content = f"""
    <div class="header">
        <h1>📚 Attendance Update</h1>
        <p>Your attendance has been recorded</p>
    </div>
    
    <div class="content">
        <h2>Hello, {student_name}! 👋</h2>
        <p>Your attendance has been successfully recorded for today's class:</p>
        
        <div class="attendance-card">
            <h3 style="color: #667eea; margin-bottom: 15px;">📋 Attendance Details</h3>
            <p><strong>📖 Subject:</strong> {subject}</p>
            <p><strong>📅 Date:</strong> {date}</p>
            <p><strong>⏰ Period:</strong> {period}</p>
            <p><strong>📝 Recorded:</strong> {current_time}</p>
            
            <div style="margin: 20px 0;">
                <span class="attendance-status {status_class}">
                    {status_emoji} {status.upper()}
                </span>
            </div>
        </div>
        
        {"<div class='success-box'><p><strong>🎉 Great job!</strong> Keep up the excellent attendance record!</p></div>" if status.lower() == "present" else "<div class='warning-box'><p><strong>⚠️ Important Notice:</strong> Please ensure regular attendance for better academic performance.</p></div>"}
        
        <div class="info-box">
            <p><strong>📊 Attendance Tips:</strong></p>
            <ul style="margin: 10px 0 0 20px;">
                <li>Regular attendance improves understanding</li>
                <li>Aim for at least 75% attendance</li>
                <li>Contact your instructor if you have concerns</li>
            </ul>
        </div>
        
        <div class="divider"></div>
        
        <p>If you have any questions about your attendance, please contact your instructor or the academic office.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated attendance notification.</p>
        <p>&copy; 2025 Your Educational Institution. All rights reserved.</p>
    </div>
    """
    
    return get_base_template().format(
        title="Attendance Update",
        content=content
    )

def get_notification_template(subject: str, message: str, notification_type: str = "general"):
    """Generic notification template"""
    current_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    type_config = {
        "general": {"emoji": "📢", "color": "#667eea"},
        "urgent": {"emoji": "🚨", "color": "#dc3545"},
        "info": {"emoji": "ℹ️", "color": "#17a2b8"},
        "success": {"emoji": "✅", "color": "#28a745"},
        "warning": {"emoji": "⚠️", "color": "#ffc107"}
    }
    
    config = type_config.get(notification_type.lower(), type_config["general"])
    
    content = f"""
    <div class="header">
        <h1>{config['emoji']} {notification_type.upper()} Notification</h1>
        <p>Important message for you</p>
    </div>
    
    <div class="content">
        <h2 style="color: {config['color']};">{subject}</h2>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid {config['color']}; margin: 25px 0;">
            <p style="white-space: pre-wrap; margin: 0; font-size: 16px; line-height: 1.6;">{message}</p>
        </div>
        
        <div class="info-box">
            <p><strong>📅 Sent:</strong> {current_time}</p>
            <p><strong>🏷️ Type:</strong> {notification_type.title()}</p>
        </div>
        
        <div class="divider"></div>
        
        <p>Thank you for your attention to this notification.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated notification from our system.</p>
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
    </div>
    """
    
    return get_base_template().format(
        title=f"{notification_type.title()} Notification",
        content=content
    )

def send_email_smtp(email_data: EmailRequest) -> bool:
    """Send email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_CONFIG["email"]
        msg['To'] = ", ".join(email_data.to)
        msg['Subject'] = email_data.subject
        
        if email_data.cc:
            msg['Cc'] = ", ".join(email_data.cc)
        
        # Add body
        if email_data.html_body:
            html_part = MIMEText(email_data.html_body, 'html')
            msg.attach(html_part)
        
        text_part = MIMEText(email_data.body, 'plain')
        msg.attach(text_part)
        
        # Connect to server and send email
        server = smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"])
        server.starttls()
        server.login(EMAIL_CONFIG["email"], EMAIL_CONFIG["password"])
        
        # Prepare recipient list
        recipients = email_data.to.copy()
        if email_data.cc:
            recipients.extend(email_data.cc)
        if email_data.bcc:
            recipients.extend(email_data.bcc)
        
        server.send_message(msg, to_addrs=recipients)
        server.quit()
        
        logger.info(f"Email sent successfully to {email_data.to}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP email with beautiful HTML template"""
    try:
        html_content = get_otp_email_template(otp, "Admin")
        
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_CONFIG["email"]
        msg['To'] = to_email
        msg['Subject'] = "🔐 Admin Login OTP - Secure Access Code"
        
        # Add both text and HTML versions
        text_content = f"""
        Admin Login Verification
        
        Hello Admin!
        
        Your OTP for secure access is: {otp}
        
        This code is valid for 5 minutes only.
        
        Security Notice:
        - Do not share this code with anyone
        - If you didn't request this, please ignore this email
        
        This is an automated message.
        """
        
        text_part = MIMEText(text_content, 'plain')
        html_part = MIMEText(html_content, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        with smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
            server.starttls()
            server.login(EMAIL_CONFIG["email"], EMAIL_CONFIG["password"])
            server.send_message(msg)
        
        logger.info(f"OTP sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send OTP email: {str(e)}")
        return False

@app.get("/")
async def root():
    return {"message": "Email Service API with OTP is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "email-api-with-otp"}

@app.post("/send-email", response_model=EmailResponse)
async def send_email(email_request: EmailRequest):
    """Send a generic email"""
    
    # Validate email configuration
    if not EMAIL_CONFIG["email"] or not EMAIL_CONFIG["password"]:
        raise HTTPException(
            status_code=500, 
            detail="Email configuration is incomplete. Please check environment variables."
        )
    
    try:
        success = send_email_smtp(email_request)
        
        if success:
            return EmailResponse(
                success=True,
                message="Email sent successfully",
                email_id=f"email_{hash(str(email_request.to))}"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
            
    except Exception as e:
        logger.error(f"Error in send_email endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/contact-form", response_model=EmailResponse)
async def contact_form(contact_request: ContactFormRequest):
    """Handle contact form submissions with beautiful HTML"""
    
    # Validate email configuration
    if not EMAIL_CONFIG["email"]:
        raise HTTPException(
            status_code=500,
            detail="Email configuration is incomplete"
        )
    
    try:
        # Create beautiful HTML email
        html_body = get_contact_form_template(
            contact_request.name,
            contact_request.email,
            contact_request.subject,
            contact_request.message
        )
        
        # Simple text fallback
        text_body = f"""
        New Contact Form Submission
        
        Name: {contact_request.name}
        Email: {contact_request.email}
        Subject: {contact_request.subject}
        
        Message:
        {contact_request.message}
        
        Submitted: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        """
        
        email_data = EmailRequest(
            to=[EMAIL_CONFIG["email"]],  # Send to your email
            subject=f"📨 Contact Form: {contact_request.subject}",
            body=text_body,
            html_body=html_body
        )
        
        success = send_email_smtp(email_data)
        
        if success:
            return EmailResponse(
                success=True,
                message="Contact form submitted successfully",
                email_id=f"contact_{hash(contact_request.email)}"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send contact form")
            
    except Exception as e:
        logger.error(f"Error in contact_form endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/send-notification")
async def send_notification(
    recipient: EmailStr,
    subject: str,
    message: str,
    notification_type: str = "general"
):
    """Send notification emails with beautiful HTML"""
    
    try:
        html_content = get_notification_template(subject, message, notification_type)
        
        # Simple text fallback
        text_content = f"""
        {notification_type.upper()} NOTIFICATION
        
        {subject}
        
        {message}
        
        Sent: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        """
        
        email_data = EmailRequest(
            to=[recipient],
            subject=f"[{notification_type.upper()}] {subject}",
            body=text_content,
            html_body=html_content
        )
        
        success = send_email_smtp(email_data)
        
        if success:
            return {"success": True, "message": "Notification sent"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send notification")
            
    except Exception as e:
        logger.error(f"Error in send_notification endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/send-attendance-notification")
async def send_attendance_notification(
    student_email: EmailStr,
    student_name: str,
    subject: str,
    date: str,
    period: str,
    status: str
):
    """Send attendance notification with beautiful HTML"""
    
    try:
        html_content = get_attendance_email_template(
            student_name, subject, date, period, status
        )
        
        # Simple text fallback
        text_content = f"""
        Attendance Update for {student_name}
        
        Subject: {subject}
        Date: {date}
        Period: {period}
        Status: {status.upper()}
        
        {"Great job! Keep up the excellent attendance record!" if status.lower() == "present" else "Please ensure regular attendance for better academic performance."}
        
        Recorded: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        """
        
        email_data = EmailRequest(
            to=[student_email],
            subject=f"📚 Attendance Update - {subject} ({status.title()})",
            body=text_content,
            html_body=html_content
        )
        
        success = send_email_smtp(email_data)
        
        if success:
            return {"success": True, "message": "Attendance notification sent"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send attendance notification")
            
    except Exception as e:
        logger.error(f"Error in send_attendance_notification endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# OTP Endpoints
@app.post("/send-otp", response_model=OTPResponse)
async def send_otp(email: EmailStr = Form(...)):
    """Send OTP for admin login with beautiful HTML"""
    
    # Validate email configuration
    if not EMAIL_CONFIG["email"] or not EMAIL_CONFIG["password"]:
        raise HTTPException(
            status_code=500,
            detail="Email configuration is incomplete"
        )
    
    # Check if it's admin email
    if not ADMIN_EMAIL:
        raise HTTPException(status_code=500, detail="Admin email not configured")
    
    if email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    try:
        # Generate OTP
        otp = random.randint(100000, 999999)
        expiry = time.time() + 300  # 5 minutes
        OTP_STORE[email] = (str(otp), expiry)
        
        # Send OTP email with beautiful HTML
        success = send_otp_email(email, str(otp))
        
        if success:
            return OTPResponse(message="OTP sent successfully")
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
            
    except Exception as e:
        logger.error(f"Error in send_otp endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/verify-otp", response_model=OTPResponse)
async def verify_otp(email: EmailStr = Form(...), otp: str = Form(...)):
    """Verify OTP for admin login"""
    
    # Check if it's admin email
    if not ADMIN_EMAIL:
        raise HTTPException(status_code=500, detail="Admin email not configured")
    
    if email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    if email not in OTP_STORE:
        raise HTTPException(status_code=400, detail="No OTP requested")
    
    stored_otp, expiry = OTP_STORE[email]
    
    # Check if OTP expired
    if time.time() > expiry:
        del OTP_STORE[email]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    # Verify OTP
    if otp != stored_otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # OTP is valid, clean up
    del OTP_STORE[email]
    
    return OTPResponse(
        message="OTP verified successfully", 
        token="admin-session-token"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)