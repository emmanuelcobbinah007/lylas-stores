import nodemailer from "nodemailer";

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string;
}

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send order completion email with review request
export async function sendOrderCompletionEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  orderItems: OrderItem[]
): Promise<void> {
  try {
    const transporter = createTransporter();

    // Generate review links for each product
    const reviewLinks = orderItems
      .map((item, index) => {
        const reviewUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders?orderId=${orderId}&tab=reviews`;
        return `<li><a href="${reviewUrl}" style="color: #2563eb; text-decoration: none;">Leave a review for ${
          item.productName
        }${item.size ? ` (Size: ${item.size})` : ""}</a></li>`;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Order is Complete!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Lyla's</h1>
            <p style="color: #666; margin: 5px 0;">Your order has been completed!</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Hello ${customerName}!</h2>
            <p>Great news! Your order <strong>#${orderId}</strong> has been completed and is on its way to you.</p>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
              <ul style="list-style: none; padding: 0;">
                ${orderItems
                  .map(
                    (item) => `
                  <li style="padding: 5px 0; border-bottom: 1px solid #eee;">
                    <strong>${item.productName}</strong> - Quantity: ${
                      item.quantity
                    }${item.size ? ` (Size: ${item.size})` : ""}
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">Help us improve! 🌟</h3>
            <p style="margin-bottom: 15px;">Your feedback is incredibly valuable to us. Please take a moment to share your experience with the products you purchased:</p>

            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0 0 10px 0;"><strong>Leave reviews for:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                ${reviewLinks}
              </ul>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin-bottom: 10px;">Thank you for shopping with Lyla's!</p>
            <p style="color: #666; font-size: 14px;">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div style="margin-top: 20px;">
              <a href="${
                process.env.NEXT_PUBLIC_API_URL
              }" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Continue Shopping</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Lyla's Store" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Your Order #${orderId} is Complete! - Lyla's`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Order completion email sent to ${customerEmail} for order ${orderId}`
    );
  } catch (error) {
    console.error("Error sending order completion email:", error);
    throw new Error("Failed to send order completion email");
  }
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  orderItems: OrderItem[],
  totalAmount: number
): Promise<void> {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmed - Lyla's</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Lyla's</h1>
            <p style="color: #666; margin: 5px 0;">Payment Confirmation</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e40af; margin-top: 0;">Payment Successful! 🎉</h2>
            <p>Hello ${customerName},</p>
            <p>Thank you for your payment! Your order has been confirmed and is now being processed.</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Order Summary:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Total Amount:</strong> ₵${totalAmount.toFixed(2)}</p>

            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h4 style="margin-top: 0; color: #333;">Items Ordered:</h4>
              <ul style="list-style: none; padding: 0;">
                ${orderItems
                  .map(
                    (item) => `
                  <li style="padding: 5px 0; border-bottom: 1px solid #eee;">
                    <strong>${item.productName}</strong> - Quantity: ${
                      item.quantity
                    }${item.size ? ` (Size: ${item.size})` : ""}
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>What's next?</strong> We'll send you another email once your order ships. You can track your order status in your account dashboard.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin-bottom: 10px;">Thank you for choosing Lyla's!</p>
            <div style="margin-top: 20px;">
              <a href="${
                process.env.NEXT_PUBLIC_API_URL
              }/orders" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order Status</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Lyla's Store" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Payment Confirmed - Order #${orderId} - Lyla's`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Payment confirmation email sent to ${customerEmail} for order ${orderId}`
    );
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    throw new Error("Failed to send payment confirmation email");
  }
}
