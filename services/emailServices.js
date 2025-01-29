import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import { generateQRCode } from "../utils/qrCodegenerator.js";

export const sendEmail = async (to, subject, name, message, data) => {
  const QRCodeURL = await generateQRCode(to, data);

  const templateContent = fs.readFileSync("templates/emailTemplate.html", "utf-8");
  const template = Handlebars.compile(templateContent);
  const htmlContent = template({ name, message, QRCodeURL });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);

  return QRCodeURL;
};