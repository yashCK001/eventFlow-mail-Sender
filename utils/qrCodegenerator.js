import QRcode from "qrcode";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const generateQRCode = async (email, data) => {
  const qrCodeDirectory = "qrcodes";
  const qrCodeFilePath = `${qrCodeDirectory}/${email}.png`;

  const qrCodeContent = JSON.stringify({
    EMAIL: email,
    DATA: data,
  });

  if (!fs.existsSync(qrCodeDirectory)) {
    fs.mkdirSync(qrCodeDirectory, { recursive: true });
  }

  await QRcode.toFile(qrCodeFilePath, qrCodeContent);

  const uploadResult = await cloudinary.uploader.upload(qrCodeFilePath, {
    folder: "qrCodes",
  });

  fs.unlinkSync(qrCodeFilePath);

  return uploadResult.secure_url;
};