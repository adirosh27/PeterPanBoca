import nodemailer from 'nodemailer';

// Create transporter for Gmail
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventName: string;
  adults: number;
  children: number;
  childrenAges?: string;
  specialRequests?: string;
}

export async function sendConfirmationEmail(registrationData: RegistrationData, registrationId: string): Promise<boolean> {
  try {
    // Create transporter
    const transporter = createTransporter();
    if (!transporter) {
      console.log('Gmail credentials not configured - skipping email');
      return false;
    }

    const { firstName, lastName, email, eventName, adults, children, childrenAges, specialRequests } = registrationData;

    // Create email content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #a7f3d0 0%, #fef3c7 50%, #bbf7d0 100%);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(45deg, #10b981, #fbbf24, #34d399);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 2rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 1.2rem;
            color: #10b981;
            margin-bottom: 20px;
        }
        .details {
            background: #f8fafc;
            border: 2px solid #facc15;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .detail-label {
            font-weight: bold;
            color: #15803d;
        }
        .detail-value {
            color: #374151;
        }
        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .highlight {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Peter Pan Boca</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.1rem;">Registration Confirmation</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${firstName} ${lastName}! 👋
            </div>
            
            <p>Thank you for registering for our Peter Pan event! We're excited to have you join us for this magical experience.</p>
            
            <div class="details">
                <h3 style="margin-top: 0; color: #15803d;">📋 Registration Details</h3>
                
                <div class="detail-row">
                    <span class="detail-label">🎪 Event:</span>
                    <span class="detail-value">${eventName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👤 Name:</span>
                    <span class="detail-value">${firstName} ${lastName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📧 Email:</span>
                    <span class="detail-value">${email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👥 Adults:</span>
                    <span class="detail-value">${adults}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👶 Children:</span>
                    <span class="detail-value">${children}</span>
                </div>
                
                ${childrenAges ? `
                <div class="detail-row">
                    <span class="detail-label">🎂 Children Ages:</span>
                    <span class="detail-value">${childrenAges}</span>
                </div>
                ` : ''}
                
                ${specialRequests ? `
                <div class="detail-row">
                    <span class="detail-label">💬 Special Requests:</span>
                    <span class="detail-value">${specialRequests}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">🆔 Registration ID:</span>
                    <span class="detail-value">${registrationId}</span>
                </div>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul>
                <li>Save this email for your records</li>
                <li>We'll contact you with additional event details closer to the date</li>
                <li>If you have any questions, please don't hesitate to reach out</li>
            </ul>
            
            <p class="highlight" style="font-size: 1.1rem; text-align: center; margin-top: 30px;">
                We can't wait to see you at this magical Peter Pan experience! ✨
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Peter Pan Boca</strong></p>
            <p>Thank you for choosing our magical experience!</p>
            <p style="font-size: 0.8rem; margin-top: 15px;">
                This is an automated confirmation email. Please keep it for your records.
            </p>
        </div>
    </div>
</body>
</html>
    `;

    const emailText = `
Peter Pan Boca - Registration Confirmation

Hello ${firstName} ${lastName}!

Thank you for registering for our Peter Pan event! Here are your registration details:

Event: ${eventName}
Name: ${firstName} ${lastName}
Email: ${email}
Adults: ${adults}
Children: ${children}
${childrenAges ? `Children Ages: ${childrenAges}` : ''}
${specialRequests ? `Special Requests: ${specialRequests}` : ''}
Registration ID: ${registrationId}

We'll contact you with additional event details closer to the date. If you have any questions, please don't hesitate to reach out.

We can't wait to see you at this magical Peter Pan experience!

Best regards,
The Peter Pan Boca Team
    `;

    const mailOptions = {
      from: `"Peter Pan Boca" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🎭 Registration Confirmed - ${eventName}`,
      html: emailHtml,
      text: emailText,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Confirmation email sent successfully:', {
      messageId: info.messageId,
      recipient: email,
      registrationId: registrationId
    });

    return true;
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return false;
  }
}

export async function sendAdminNotification(registrationData: RegistrationData, registrationId: string): Promise<boolean> {
  try {
    // Create transporter and check admin email
    const transporter = createTransporter();
    if (!transporter || !process.env.ADMIN_EMAIL) {
      console.log('Gmail or admin email not configured - skipping admin notification');
      return false;
    }

    const { firstName, lastName, email, phone, eventName, adults, children, childrenAges, specialRequests } = registrationData;
    
    const totalPeople = adults + children;

    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .details { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .row { margin: 10px 0; }
        .label { font-weight: bold; color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎭 New Registration - Peter Pan Boca</h2>
        </div>
        
        <div class="details">
            <div class="row">
                <span class="label">Name:</span> ${firstName} ${lastName}
            </div>
            <div class="row">
                <span class="label">Email:</span> ${email}
            </div>
            <div class="row">
                <span class="label">Phone:</span> ${phone}
            </div>
            <div class="row">
                <span class="label">Event:</span> ${eventName}
            </div>
            <div class="row">
                <span class="label">Adults:</span> ${adults}
            </div>
            <div class="row">
                <span class="label">Children:</span> ${children}
            </div>
            <div class="row">
                <span class="label">Total People:</span> ${totalPeople}
            </div>
            ${childrenAges ? `<div class="row"><span class="label">Children Ages:</span> ${childrenAges}</div>` : ''}
            ${specialRequests ? `<div class="row"><span class="label">Special Requests:</span> ${specialRequests}</div>` : ''}
            <div class="row">
                <span class="label">Registration ID:</span> ${registrationId}
            </div>
            <div class="row">
                <span class="label">Registration Time:</span> ${new Date().toLocaleString()}
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"Peter Pan Boca" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎪 New Registration: ${firstName} ${lastName} - ${eventName}`,
      html: adminEmailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Admin notification sent successfully:', {
      messageId: info.messageId,
      registrationId: registrationId
    });

    return true;
  } catch (error) {
    console.error('Error in sendAdminNotification:', error);
    return false;
  }
}