import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
async function sendEmail(to_sender, subjects, message) {
  const info = await transporter.sendMail({
    from: `"Read Verse" <${process.env.EMAIL_NAME}>`,
    to: to_sender,
    subject: subjects,
    html: message,
  });

  console.log("Message sent:", info.messageId);
}
export { sendEmail };
