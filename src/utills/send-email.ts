import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
const port = process.env.PORT || "3000";

export async function sendVerificationEmail(
  toEmail: string,
  token: string
): Promise<void> {
  if (!gmailUser || !gmailPass) {
    console.error("GMAIL_USER or GMAIL_PASS is not defined in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const verifyLink = `http://localhost:${port}/api/v1/user/verify-email?token=${token}`;

  const mailOptions = {
    from: `"My App" <${gmailUser}>`,
    to: toEmail,
    subject: "Welcome to My App! Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
        <img src="https://yourdomain.com/logo.png" alt="My App Logo" style="width: 120px; margin-bottom: 25px;" />
        <h1 style="color: #6A1B9A; font-size: 34px; margin-bottom: 20px;">
          Welcome to My App!
        </h1>
        <p style="font-size: 18px; color: #333; line-height: 1.6; margin: 0 auto 30px auto; max-width: 550px;">
          We're thrilled to have you as part of our community! My App is designed to make your life easier and more organized. 
          Please verify your email address below to start exploring all the amazing features and benefits we offer. Your journey with us starts now!
        </p>
        <a href="${verifyLink}" 
           style="
             display: inline-block;
             padding: 15px 35px;
             margin: 20px 0;
             font-size: 18px;
             font-weight: bold;
             color: #fff;
             background-color: #8E24AA;
             text-decoration: none;
             border-radius: 10px;
             box-shadow: 0 5px 10px rgba(0,0,0,0.15);
             transition: background-color 0.3s ease;
           "
           target="_blank">
          Click To Verify
        </a>
        <p style="font-size: 14px; color: #555; margin-top: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", toEmail);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    console.error("GMAIL_USER or GMAIL_PASS is not defined in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const mailOptions = {
    from: `"My App" <${gmailUser}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
        <h1 style="color: #6A1B9A; font-size: 28px; margin-bottom: 20px;">
          Reset Your Password
        </h1>

        <p style="font-size: 16px; color: #333; max-width: 550px; margin: 0 auto 30px auto;">
          We received a request to reset your password.
          Click the button below to choose a new one.
          This link is valid for 1 hour.
        </p>

        <a href="${resetLink}"
           style="
             display: inline-block;
             padding: 15px 35px;
             background-color: #8E24AA;
             color: #fff;
             border-radius: 10px;
             font-size: 18px;
             font-weight: bold;
             text-decoration: none;
             box-shadow: 0 5px 10px rgba(0,0,0,0.15);
           "
           target="_blank">
          Reset Password
        </a>

        <p style="font-size: 14px; color: #555; margin-top: 25px;">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export async function sendReplyEmail(
  toEmail: string,
  userName: string,
  message: string
) {
  const htmlContent = `
  <html>
    <body style="margin:0; padding:0; font-family: 'Helvetica', Arial, sans-serif; background-color:#f3f0f7;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 10px 20px rgba(0,0,0,0.1); overflow:hidden;">
              <tr>
                <td style="background: linear-gradient(90deg, #8E24AA, #BA68C8); text-align:center; padding:25px;">
                  <h1 style="margin:0; color:#fff; font-size:28px;">Support Reply</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; color:#333;">
                  <p style="font-size:16px;">Hi <strong>${userName}</strong>,</p>
                  <p style="font-size:16px;">Our support team has replied to your request. See the message below:</p>
                  <div style="background:#f4e6fa; border-left:5px solid #8E24AA; padding:20px; border-radius:8px; font-size:15px; line-height:1.6; color:#4b0082; margin:20px 0;">
                    ${message}
                  </div>
                  <div style="text-align:center; margin:30px 0;">
                    <a href="mailto:${toEmail}" 
                      style="
                        display:inline-block;
                        background:#8E24AA;
                        color:#fff;
                        text-decoration:none;
                        padding:12px 25px;
                        border-radius:8px;
                        font-weight:bold;
                        font-size:16px;
                        box-shadow:0 5px 15px rgba(0,0,0,0.15);
                        transition: all 0.3s ease;
                      "
                      target="_blank"
                    >
                      Reply to Support
                    </a>
                  </div>
                  <p style="font-size:16px;">If you have further questions, feel free to reply to this email.</p>
                  <p style="margin-top:30px; font-size:16px;">Best regards,<br><strong>My App Support Team</strong></p>
                </td>
              </tr>
              <tr>
                <td style="background:#8E24AA; color:#fff; text-align:center; padding:15px; font-size:14px;">
                  &copy; ${new Date().getFullYear()} My App. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  await sendEmail(toEmail, "Reply from Support Team", htmlContent);
}
