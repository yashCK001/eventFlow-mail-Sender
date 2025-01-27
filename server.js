import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import Handlebars from "handlebars";
import QRcode from "qrcode";
import cloudinary from "./cloudinary.js";

dotenv.config();

const USER = process.env.USER;
const PASS = process.env.PASS;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Server health okay ✅",
  });
});

app.post("/send-email", async (req, res) => {
  const { to, subject, name, message, data } = req.body;

  if (!to || !subject || !name || !data) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  try {
    // this will generate the qr code for the email
    // we need to add this in the template of html : {{QRCodeURL}}

    const qrCodeFilePath = `./qrCodes/${to}.png`;
    await QRcode.toFile(qrCodeFilePath, to);

    const uploadResult = await cloudinary.uploader.upload(qrCodeFilePath, {
      folder: "qrCodes",
    });

    //url will be in the result.secure_url

    const QRCodeURL = uploadResult.secure_url;

    // const QRCodeURL = await QRcode.toDataURL(to); => no need for generting base64 string from image

    fs.unlinkSync(qrCodeFilePath);

    const templateContent = fs.readFileSync("emailTemplate.html", "utf-8");
    const template = Handlebars.compile(templateContent);

    const htmlContent = template({ name, message, QRCodeURL });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: `Email sent to ${to}`,
      qrcodeUrl: QRCodeURL,
    });
  } catch (error) {
    console.error(`Error sending mail`, error);
    res.status(500).json({
      error: "Failed to send email",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});
