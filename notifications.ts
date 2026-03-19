// Notification service - sends alerts via email, SMS, push, and in-app

export interface NotificationPayload {
  userId: string
  userName: string
  email: string
  phone?: string
  signal: {
    symbol: string
    action: "BUY" | "SELL"
    entry: number
    stop: number
    target: number
    pattern: string
    riskReward: string
  }
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
}

export interface NotificationResult {
  userId: string
  email?: { success: boolean; error?: string }
  sms?: { success: boolean; error?: string }
  push?: { success: boolean; error?: string }
  inApp?: { success: boolean; error?: string }
}

// Main function to send notifications through all enabled channels
export async function sendNotifications(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const result: NotificationResult = { userId: payload.userId }

  const promises: Promise<void>[] = []

  if (payload.channels.email) {
    promises.push(
      sendEmailNotification(payload)
        .then(() => { result.email = { success: true } })
        .catch((e) => { result.email = { success: false, error: e.message } })
    )
  }

  if (payload.channels.sms && payload.phone) {
    promises.push(
      sendSMSNotification(payload)
        .then(() => { result.sms = { success: true } })
        .catch((e) => { result.sms = { success: false, error: e.message } })
    )
  }

  if (payload.channels.push) {
    promises.push(
      sendPushNotification(payload)
        .then(() => { result.push = { success: true } })
        .catch((e) => { result.push = { success: false, error: e.message } })
    )
  }

  if (payload.channels.inApp) {
    promises.push(
      saveInAppNotification(payload)
        .then(() => { result.inApp = { success: true } })
        .catch((e) => { result.inApp = { success: false, error: e.message } })
    )
  }

  await Promise.all(promises)
  return result
}

// Email notification using Resend (recommended) or similar service
async function sendEmailNotification(payload: NotificationPayload): Promise<void> {
  const { signal, email, userName } = payload
  
  // TODO: Integrate with Resend, SendGrid, or similar
  // Example with Resend:
  // 
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // 
  // await resend.emails.send({
  //   from: 'alerts@sightline.trading',
  //   to: email,
  //   subject: `${signal.action} Alert: ${signal.symbol}`,
  //   html: generateEmailTemplate(payload),
  // })

  console.log(`[Notification] Email to ${email}:`, {
    subject: `${signal.action} Alert: ${signal.symbol}`,
    body: `
      Hi ${userName},
      
      New ${signal.action} signal detected:
      
      Symbol: ${signal.symbol}
      Entry: $${signal.entry}
      Stop: $${signal.stop}
      Target: $${signal.target}
      Risk/Reward: ${signal.riskReward}
      Pattern: ${signal.pattern}
      
      - SightLine Advanced Trading Analytics
    `,
  })
}

// SMS notification using Twilio or similar
async function sendSMSNotification(payload: NotificationPayload): Promise<void> {
  const { signal, phone } = payload
  
  // TODO: Integrate with Twilio
  // 
  // import twilio from 'twilio'
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  // 
  // await client.messages.create({
  //   body: `SightLine: ${signal.action} ${signal.symbol} @ $${signal.entry} | Stop: $${signal.stop} | Target: $${signal.target} | ${signal.riskReward}`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone,
  // })

  console.log(`[Notification] SMS to ${phone}:`, 
    `SightLine: ${signal.action} ${signal.symbol} @ $${signal.entry} | Stop: $${signal.stop} | Target: $${signal.target} | ${signal.riskReward}`
  )
}

// Push notification using web-push or Firebase
async function sendPushNotification(payload: NotificationPayload): Promise<void> {
  const { signal, userId } = payload
  
  // TODO: Integrate with web-push or Firebase Cloud Messaging
  //
  // import webpush from 'web-push'
  // 
  // const subscription = await getUserPushSubscription(userId) // from Supabase
  // await webpush.sendNotification(subscription, JSON.stringify({
  //   title: `${signal.action}: ${signal.symbol}`,
  //   body: `Entry: $${signal.entry} | Target: $${signal.target} | ${signal.riskReward}`,
  //   icon: '/icon-192x192.png',
  //   data: { signal },
  // }))

  console.log(`[Notification] Push to user ${userId}:`, {
    title: `${signal.action}: ${signal.symbol}`,
    body: `Entry: $${signal.entry} | Target: $${signal.target} | ${signal.riskReward}`,
  })
}

// In-app notification (saved to database for display in dashboard)
async function saveInAppNotification(payload: NotificationPayload): Promise<void> {
  const { signal, userId } = payload
  
  // TODO: Save to Supabase
  //
  // await supabase.from('notifications').insert({
  //   user_id: userId,
  //   type: 'signal',
  //   title: `${signal.action}: ${signal.symbol}`,
  //   body: `Entry: $${signal.entry} | Stop: $${signal.stop} | Target: $${signal.target}`,
  //   data: signal,
  //   read: false,
  //   created_at: new Date().toISOString(),
  // })

  console.log(`[Notification] In-app for user ${userId}:`, {
    type: 'signal',
    title: `${signal.action}: ${signal.symbol}`,
    data: signal,
  })
}

// Generate HTML email template
export function generateEmailTemplate(payload: NotificationPayload): string {
  const { signal, userName } = payload
  const actionColor = signal.action === "BUY" ? "#22C55E" : "#EF4444"
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #030806; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #22C55E; font-size: 24px; margin: 0;">SightLine</h1>
          <p style="color: #6B8F71; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0;">TRADING ANALYTICS</p>
        </div>
        
        <div style="background: #061208; border: 1px solid #143D1A; border-radius: 12px; padding: 24px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="background: ${actionColor}; color: #030806; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
              ${signal.action} SIGNAL
            </span>
          </div>
          
          <h2 style="color: #F0FDF4; font-size: 32px; text-align: center; margin: 0 0 24px;">${signal.symbol}</h2>
          
          <div style="display: grid; gap: 12px;">
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #0A1F0D; border-radius: 8px;">
              <span style="color: #6B8F71;">Entry</span>
              <span style="color: #F0FDF4; font-weight: 600;">$${signal.entry.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #0A1F0D; border-radius: 8px;">
              <span style="color: #6B8F71;">Stop Loss</span>
              <span style="color: #EF4444; font-weight: 600;">$${signal.stop.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #0A1F0D; border-radius: 8px;">
              <span style="color: #6B8F71;">Target</span>
              <span style="color: #22C55E; font-weight: 600;">$${signal.target.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #0A1F0D; border-radius: 8px;">
              <span style="color: #6B8F71;">Risk/Reward</span>
              <span style="color: #22C55E; font-weight: 600;">${signal.riskReward}</span>
            </div>
          </div>
          
          <p style="color: #6B8F71; font-size: 12px; text-align: center; margin: 20px 0 0;">
            Pattern: ${signal.pattern}
          </p>
        </div>
        
        <p style="color: #6B8F71; font-size: 11px; text-align: center; margin-top: 24px; line-height: 1.5;">
          SightLine Advanced Trading Analytics does not execute trades or connect to brokerage accounts.<br>
          All information is for educational purposes only. Trade at your own risk.
        </p>
      </div>
    </body>
    </html>
  `
}
