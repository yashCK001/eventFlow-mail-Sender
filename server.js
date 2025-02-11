import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import emailRoutes from "./routes/emailroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// const corsOptions = {
//     origin: '*',
//     // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors());


/* 
app.options('/*', (_, res) => {
  res.sendStatus(200);
});
*/

app.use(rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100
}));

app.get("/health", (req, res) => {
 return res.status(201).json({
   success: true,
   message: "Server health okay ✅",
 });
});

app.use("/", emailRoutes);  

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({
   success: false,
   message: "Something went wrong!",
 });
});

app.use((req, res) => {
 res.status(404).json({
   success: false,
   message: "Route not found",
 });
});

app.use(express.static('public', {  
  setHeaders: (res, path) => {  
    if (path.endsWith('.js')) {  
      res.setHeader('Content-Type', 'application/javascript');  
    }  
  }  
}));

app.listen(PORT, () => {
 console.log(`Server started at localhost:${PORT}`);
});