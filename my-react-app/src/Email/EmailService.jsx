// EmailService.jsx
const API_BASE_URL = 'http://localhost:8000';

class EmailService {
  async sendEmail(emailData) {
    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  async sendContactForm(contactData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send contact form');
      }

      return await response.json();
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }

  async sendNotification(recipient, subject, message, type = 'general') {
    try {
      const response = await fetch(`${API_BASE_URL}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          subject,
          message,
          notification_type: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

export default new EmailService();