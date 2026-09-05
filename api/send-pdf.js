const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderNo, customer, summary, pdfBase64 } = req.body;
    const senderEmail = process.env.SENDER_EMAIL || 'selvaganapathytraders@gmail.com';
    const mailPassword = process.env.MAIL_PASSWORD;
    const shopkeeperEmails = ['selvaganapathytraders@gmail.com', 'sudali599@gmail.com'];

    if (!mailPassword) {
      console.warn('MAIL_PASSWORD not set in environment variables');
      return res.status(200).json({ 
        message: 'Order registered. Please configure MAIL_PASSWORD in Vercel for direct SMTP dispatch.',
        orderNo 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: mailPassword,
      },
    });

    const recipients = [...shopkeeperEmails];
    if (customer?.email && customer.email.trim() && !recipients.includes(customer.email.trim())) {
      recipients.push(customer.email.trim());
    }

    const attachments = [];
    if (pdfBase64) {
      attachments.push({
        filename: `Estimate_${orderNo || '2026'}.pdf`,
        content: pdfBase64.replace(/^data:application\/pdf;base64,/, ''),
        encoding: 'base64',
        contentType: 'application/pdf',
      });
    }

    const mailOptions = {
      from: `"Selvaganapathy Traders" <${senderEmail}>`,
      to: recipients.join(', '),
      subject: `Official Order PDF Estimate [${orderNo}] - ₹${summary?.grandTotal?.toFixed(2) || '0.00'} (${customer?.name || 'Customer'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #1e1b4b, #831843); padding: 20px; text-align: center; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 22px; color: #fde047;">SELVAGANAPATHY TRADERS</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #fbcfe8;">Sun Flag Fireworks &amp; Sparklers • Sivakasi</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 15px;">
            <h2 style="color: #0f172a; margin-top: 0;">Order PDF Estimate Attached</h2>
            <p style="color: #475569; line-height: 1.5;">
              A purchase estimate has been registered. The formal A4 estimate PDF document is attached to this email.
            </p>
            <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; border-left: 4px solid #059669; margin: 15px 0; font-size: 13px; color: #334155;">
              <strong>Estimate Ref:</strong> ${orderNo}<br>
              <strong>Customer Name:</strong> ${customer?.name || 'Valued Customer'}<br>
              <strong>Phone:</strong> ${customer?.phone || '-'}<br>
              <strong>Address:</strong> ${customer?.address || '-'}, ${customer?.city || ''}<br>
              <strong>Order Total:</strong> ₹${summary?.grandTotal?.toFixed(2) || '0.00'} (${summary?.totalQuantity || 0} boxes)
            </div>
          </div>

          <div style="text-align: center; padding: 15px; color: #94a3b8; font-size: 11px;">
            Selvaganapathy Traders • Helpline: +91 6383144854 / +91 99440 87728
          </div>
        </div>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'PDF successfully dispatched to shopkeeper', orderNo });
  } catch (error) {
    console.error('Serverless send-pdf error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send PDF email' });
  }
};
