import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendMail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string
  to: string
  subject: string
  html: string
}) => {
  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error("SENDMAIL_ERROR", err)
  }
}