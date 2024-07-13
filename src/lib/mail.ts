import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
interface MailProps {
  receiverEmail: string;
  subject: string;
  text?: string;
  htmlBody: string;
}
// async..await is not allowed in global scope, must use a wrapper
export async function sendMail({
  receiverEmail,
  subject,
  text,
  htmlBody,
}: MailProps) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: receiverEmail, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: htmlBody, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong on server",
    });
  }
}
