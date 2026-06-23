import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

let resend = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/**
 * Sends a password reset OTP to the user's email.
 * Falls back to console logging if Resend API key is placeholder or invalid.
 */
export const sendOTPEmail = async (email, otp) => {
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #282828; border-radius: 8px; background-color: #121212; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 28px; font-weight: bold; color: #1DB954;">Spotify Clone</span>
      </div>
      <h2 style="color: #ffffff; text-align: center; font-size: 22px; margin-bottom: 20px;">Password Reset Verification</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #b3b3b3;">Hello,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #b3b3b3;">We received a request to reset your password. Use the following 6-digit One-Time Password (OTP) to complete your verification. This code is valid for <strong>10 minutes</strong>.</p>
      <div style="background-color: #282828; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1DB954;">${otp}</span>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #7f7f7f; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #282828; margin: 30px 0;" />
      <p style="font-size: 12px; color: #7f7f7f; text-align: center;">&copy; 2026 Spotify Clone. All rights reserved.</p>
    </div>
  `;

  if (resend) {
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Spotify Clone - Password Reset Verification',
        html: htmlContent,
      });
      console.log(`[EmailService] OTP sent to ${email} via Resend. ID: ${data.id}`);
      return { success: true, method: 'resend', id: data.id };
    } catch (error) {
      console.error('[EmailService] Failed to send email via Resend:', error.message);
      console.log('\n========= OTP FALLBACK LOG =========');
      console.log(`TO: ${email}`);
      console.log(`OTP CODE: ${otp}`);
      console.log('====================================\n');
      return { success: true, method: 'console', otp };
    }
  } else {
    console.log('\n========= OTP DEV FALLBACK LOG (No Resend Key) =========');
    console.log(`TO: ${email}`);
    console.log(`OTP CODE: ${otp}`);
    console.log('======================================================\n');
    return { success: true, method: 'console', otp };
  }
};
