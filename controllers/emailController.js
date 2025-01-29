import { sendEmail } from "../services/emailServices.js";

export const sendEmailController = async (req, res) => {
  const { to, subject, name, message, data } = req.body;

  if (!to || !subject || !name || !data) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  try {
    const qrCodeUrl = await sendEmail(to, subject, name, message, data);

    res.status(200).json({
      message: `Email sent to ${to}`,
      qrcodeUrl: qrCodeUrl,
    });
  } catch (error) {
    console.error(`Error sending mail`, error);
    res.status(500).json({
      error: "Failed to send email",
    });
  }
};