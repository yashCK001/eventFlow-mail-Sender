import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import Handlebars from "handlebars";

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
        message: "Server health okay ✅"
    })
});

app.post('/send-email', async(req, res) => {
    const {to, subject, name, message} = req.body;

    if(!to || !subject ||!name){
        return res.status(400).json({
            error: "All fields are required"
        })
    };

    try{

        const templateContent = fs.readFileSync("emailTemplate.html", "utf-8");

        const template = Handlebars.compile(templateContent);

        console.log("Message" , message);
        
        
        const htmlContent = template({name, message});
        console.log("Message 2 " , message);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: USER,
                pass: PASS
            }
        });
        
        const mailOptions = {
            from: process.env.USER,
            to,
            subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `Email sent to ${to}` });

    }catch(error){
        console.error(`Error sending mail`, error);
        res.status(500).json({
            error: "Failed to send email"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server started at localhost:${PORT}`)
});