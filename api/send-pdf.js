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
    const senderEmail = process.env.SENDER_EMAIL || 'sudali599@gmail.com';
    const mailPassword = process.env.MAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || 'aalfrphjajyiiwdj';
    const shopkeeperEmails = ['selvaganapathytraders@gmail.com', 'sudali599@gmail.com'];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: mailPassword.replace(/\s+/g, ''), // Strip spaces from Gmail App Password
      },
    });

    const recipients = [...shopkeeperEmails];
    if (customer?.email && customer.email.trim() && !recipients.includes(customer.email.trim())) {
      recipients.push(customer.email.trim());
    }

    const itemsRowsHtml = (summary?.cartItems || []).map((item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 6px 8px; text-align: center; font-size: 11px; color: #64748b;">${item.id || '-'}</td>
        <td style="padding: 6px 8px; font-size: 11px; font-weight: bold; color: #0f172a;">${item.name}</td>
        <td style="padding: 6px 8px; font-size: 11px; color: #475569;">${item.category || ''}</td>
        <td style="padding: 6px 8px; font-size: 11px; text-align: center;">${item.per || '1 Pkt'}</td>
        <td style="padding: 6px 8px; font-size: 11px; text-align: right;">₹${Number(item.price || 0).toFixed(2)}</td>
        <td style="padding: 6px 8px; font-size: 11px; text-align: center; font-weight: bold; color: #0f172a;">${item.qty}</td>
        <td style="padding: 6px 8px; font-size: 11px; text-align: right; font-weight: bold; color: #059669;">₹${Number(item.itemTotal || 0).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Selvaganapathy Traders" <${senderEmail}>`,
      to: recipients.join(', '),
      replyTo: customer?.email && customer.email.trim() ? customer.email.trim() : senderEmail,
      subject: `Official Order Confirmation [${orderNo}] - ₹${summary?.grandTotal?.toFixed(2) || '0.00'} (${customer?.name || 'Customer'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <!-- Brand Header -->
          <div style="background: linear-gradient(135deg, #1e1b4b, #831843); padding: 20px; text-align: center; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 22px; color: #fde047;">SELVAGANAPATHY TRADERS</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #fbcfe8;">Sun Flag Fireworks &amp; Sparklers • Sivakasi</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #cbd5e1;">Kananjampatti, Sivakasi | Phone: +91 6383144854 / +91 99440 87728</p>
          </div>
          
          <!-- Summary Container -->
          <div style="background-color: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">✓ ORDER CONFIRMED</span>
                <h3 style="margin: 6px 0 0 0; color: #0f172a; font-size: 15px;">Order Ref: ${orderNo}</h3>
              </div>
              <div style="text-align: right; color: #64748b; font-size: 11px;">
                <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
                <strong>Status:</strong> Ready for Dispatch
              </div>
            </div>

            <!-- Customer Details Block -->
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #059669; margin: 12px 0; font-size: 12px; color: #334155;">
              <strong>Customer Name:</strong> ${customer?.name || 'Valued Customer'}<br>
              <strong>Phone:</strong> ${customer?.phone || '-'}<br>
              ${customer?.email ? `<strong>Email:</strong> ${customer.email}<br>` : ''}
              <strong>Delivery Address:</strong> ${customer?.address || '-'}, ${customer?.city || ''} ${customer?.pincode ? '- ' + customer.pincode : ''}<br>
              ${customer?.notes ? `<strong>Notes / Instructions:</strong> ${customer.notes}<br>` : ''}
              <strong>Order Scope:</strong> ${summary?.totalItems || 0} varieties (${summary?.totalQuantity || 0} total boxes)
            </div>

            <!-- Itemized Receipt Table -->
            <h4 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 13px; text-transform: uppercase;">🛒 Ordered Items Breakdown:</h4>
            <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 14px;">
              <thead>
                <tr style="background: #0f172a; color: white;">
                  <th style="padding: 6px 8px; font-size: 10px; text-align: center; width: 30px;">#</th>
                  <th style="padding: 6px 8px; font-size: 10px;">Item Description</th>
                  <th style="padding: 6px 8px; font-size: 10px; width: 110px;">Category</th>
                  <th style="padding: 6px 8px; font-size: 10px; text-align: center; width: 50px;">Pack</th>
                  <th style="padding: 6px 8px; font-size: 10px; text-align: right; width: 65px;">Rate (₹)</th>
                  <th style="padding: 6px 8px; font-size: 10px; text-align: center; width: 40px;">Qty</th>
                  <th style="padding: 6px 8px; font-size: 10px; text-align: right; width: 75px;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #0f172a; color: white; font-weight: bold;">
                  <td colspan="5" style="padding: 8px 10px; text-align: right; font-size: 12px;">GRAND TOTAL:</td>
                  <td style="padding: 8px 10px; text-align: center; font-size: 12px;">${summary?.totalQuantity || 0}</td>
                  <td style="padding: 8px 10px; text-align: right; font-size: 13px; color: #4ade80;">₹${Number(summary?.grandTotal || 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <p style="font-size: 11px; color: #64748b; margin: 12px 0 0 0; text-align: center;">
              🎆 <em>Thank you for shopping with Selvaganapathy Traders Sivakasi!</em>
            </p>
          </div>

          <div style="text-align: center; padding: 15px; color: #94a3b8; font-size: 11px;">
            Selvaganapathy Traders • Sun Flag Fireworks, Sivakasi • Helpline: +91 6383144854 / +91 99440 87728
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'PDF successfully dispatched to shopkeeper', orderNo });
  } catch (error) {
    console.error('Serverless send-pdf error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send PDF email' });
  }
};
