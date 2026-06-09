import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Fab Vacay Vibes <onboarding@resend.dev>'
const TO = 'FabVacayVibes@gmail.com'

export async function sendInquiryEmail({
  propertyName, firstName, lastName, email, phone, arrival, departure, adults, message
}: {
  propertyName: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  arrival?: string
  departure?: string
  adults?: number
  message: string
}) {
  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `New Inquiry — ${propertyName} from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E0F45; padding: 24px; text-align: center;">
          <h1 style="color: #F4A23A; margin: 0; font-size: 24px;">New Property Inquiry</h1>
          <p style="color: #FDF6EC; margin: 8px 0 0; opacity: 0.7">${propertyName}</p>
        </div>
        <div style="padding: 32px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 140px"><strong>Name</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Email</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Phone</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${phone || 'Not provided'}</td></tr>
            ${arrival ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Check-in</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${arrival}</td></tr>` : ''}
            ${departure ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Check-out</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${departure}</td></tr>` : ''}
            ${adults ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Guests</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${adults}</td></tr>` : ''}
          </table>
          <div style="margin-top: 24px;">
            <strong style="color: #666;">Message:</strong>
            <p style="background: white; padding: 16px; border-radius: 4px; border: 1px solid #eee; margin-top: 8px;">${message}</p>
          </div>
          <a href="mailto:${email}?subject=Re: Your inquiry about ${propertyName}" style="display: inline-block; margin-top: 24px; background: #F4A23A; color: #1E0F45; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reply to ${firstName}</a>
        </div>
        <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
          Fab Vacay Vibes · fabvacayvibes.com
        </div>
      </div>
    `,
  })
}

export async function sendLeadEmail({
  name, email, phone, role, address, bedrooms, bathrooms, guests
}: {
  name: string
  email: string
  phone?: string
  role: string
  address: string
  bedrooms: string
  bathrooms: string
  guests: string
}) {
  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `New Rent Analyzer Lead — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E0F45; padding: 24px; text-align: center;">
          <h1 style="color: #F4A23A; margin: 0; font-size: 24px;">New Rent Analyzer Lead</h1>
        </div>
        <div style="padding: 32px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 140px"><strong>Name</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Email</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Phone</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Role</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${role}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Property</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${address}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Details</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${bedrooms} BR · ${bathrooms} BA · ${guests} guests</td></tr>
          </table>
          <a href="mailto:${email}" style="display: inline-block; margin-top: 24px; background: #F4A23A; color: #1E0F45; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reply to ${name}</a>
        </div>
        <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
          Fab Vacay Vibes · fabvacayvibes.com
        </div>
      </div>
    `,
  })
}

export async function sendServiceInquiryEmail({
  name, email, phone, service, message
}: {
  name: string
  email: string
  phone?: string
  service: string
  message: string
}) {
  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `New Services Inquiry — ${service} from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E0F45; padding: 24px; text-align: center;">
          <h1 style="color: #F4A23A; margin: 0; font-size: 24px;">New Services Inquiry</h1>
          <p style="color: #FDF6EC; margin: 8px 0 0; opacity: 0.7">${service}</p>
        </div>
        <div style="padding: 32px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 140px"><strong>Name</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Email</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Phone</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666"><strong>Service</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee">${service}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <strong style="color: #666;">Message:</strong>
            <p style="background: white; padding: 16px; border-radius: 4px; border: 1px solid #eee; margin-top: 8px;">${message}</p>
          </div>
          <a href="mailto:${email}" style="display: inline-block; margin-top: 24px; background: #F4A23A; color: #1E0F45; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reply to ${name}</a>
        </div>
        <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
          Fab Vacay Vibes · fabvacayvibes.com
        </div>
      </div>
    `,
  })
}
