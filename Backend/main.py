from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
import logging


# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Email Service API", version="1.0.0")

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

# Email configuration
EMAIL_CONFIG = {
    "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    "smtp_port": int(os.getenv("SMTP_PORT", 587)),
    "email": os.getenv("EMAIL_ADDRESS"),
    "password": os.getenv("EMAIL_PASSWORD"),
}

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

@app.get("/")
async def root():
    return {"message": "Email Service API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "email-api"}

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
    """Handle contact form submissions"""
    
    # Validate email configuration
    if not EMAIL_CONFIG["email"]:
        raise HTTPException(
            status_code=500,
            detail="Email configuration is incomplete"
        )
    
    try:
        # Create email content
        html_body = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {contact_request.name}</p>
        <p><strong>Email:</strong> {contact_request.email}</p>
        <p><strong>Subject:</strong> {contact_request.subject}</p>
        <p><strong>Message:</strong></p>
        <p>{contact_request.message.replace('\n', '<br>')}</p>
        """
        
        text_body = f"""
        New Contact Form Submission
        
        Name: {contact_request.name}
        Email: {contact_request.email}
        Subject: {contact_request.subject}
        
        Message:
        {contact_request.message}
        """
        
        email_data = EmailRequest(
            to=[EMAIL_CONFIG["email"]],  # Send to your email
            subject=f"Contact Form: {contact_request.subject}",
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
    """Send notification emails (simplified endpoint)"""
    
    try:
        email_data = EmailRequest(
            to=[recipient],
            subject=f"[{notification_type.upper()}] {subject}",
            body=message,
            html_body=f"<h3>{subject}</h3><p>{message.replace('\n', '<br>')}</p>"
        )
        
        success = send_email_smtp(email_data)
        
        if success:
            return {"success": True, "message": "Notification sent"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send notification")
            
    except Exception as e:
        logger.error(f"Error in send_notification endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)