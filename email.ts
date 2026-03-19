import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SightLine <onboarding@resend.dev>"

export interface EmailResult {
  success: boolean
  error?: string
  messageId?: string
}

export async function sendVerificationEmail(
  to: string,
  verificationUrl: string,
  userName?: string
): Promise<EmailResult> {
  if (!resend) {
    console.error("[v0] RESEND_API_KEY is not configured")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Verify your SightLine account",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020403; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020403;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #07110c; border-radius: 16px; border: 1px solid #16301f;">
          <tr>
            <td style="padding: 40px 32px;">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <span style="font-size: 24px; font-weight: 700; color: #2bd673;">SightLine</span>
              </div>
              
              <!-- Heading -->
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                Verify your email
              </h1>
              
              <!-- Subheading -->
              <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #9fb3a7; text-align: center;">
                ${userName ? `Hi ${userName}, ` : ""}Click the button below to verify your email address and activate your SightLine account.
              </p>
              
              <!-- Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; padding: 14px 32px; background-color: #2bd673; color: #000000; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;"
                   target="_blank">
                  Verify Email Address
                </a>
              </div>
              
              <!-- Link fallback -->
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #7f9187; text-align: center;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 32px 0; font-size: 12px; color: #2bd673; text-align: center; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #16301f; padding-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #7f9187; text-align: center;">
                  This link expires in 24 hours. If you didn't create a SightLine account, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
        </table>
        
        <!-- Bottom text -->
        <p style="margin: 24px 0 0 0; font-size: 11px; color: #7f9187; text-align: center;">
          © ${new Date().getFullYear()} SightLine. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Verify your SightLine account

${userName ? `Hi ${userName}, ` : ""}Click the link below to verify your email address and activate your SightLine account.

${verificationUrl}

This link expires in 24 hours. If you didn't create a SightLine account, you can safely ignore this email.

© ${new Date().getFullYear()} SightLine. All rights reserved.
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    console.error("[v0] Failed to send verification email:", err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Failed to send email" 
    }
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string
): Promise<EmailResult> {
  if (!resend) {
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Reset your SightLine password",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #020403; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020403;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #07110c; border-radius: 16px; border: 1px solid #16301f;">
          <tr>
            <td style="padding: 40px 32px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <span style="font-size: 24px; font-weight: 700; color: #2bd673;">SightLine</span>
              </div>
              
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                Reset your password
              </h1>
              
              <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.6; color: #9fb3a7; text-align: center;">
                ${userName ? `Hi ${userName}, ` : ""}We received a request to reset your password. Click the button below to create a new password.
              </p>
              
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 14px 32px; background-color: #2bd673; color: #000000; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px;">
                  Reset Password
                </a>
              </div>
              
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #7f9187; text-align: center;">
                Or copy and paste this link:
              </p>
              <p style="margin: 0 0 32px 0; font-size: 12px; color: #2bd673; text-align: center; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <div style="border-top: 1px solid #16301f; padding-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #7f9187; text-align: center;">
                  This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "Failed to send email" 
    }
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}
