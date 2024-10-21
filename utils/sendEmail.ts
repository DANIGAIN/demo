import { logger } from "./logger";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "danigain1234@gmail.com",
      pass: "vyop exgz xtmu tznf",
    },        
  });                    
    
export async function sendEmail(receiver , type , subject , html) {
    if(type === 'varify'){
        const info =  await transporter.sendMail({
            from: "danigain1234@gmail.com", 
            to: receiver,
            subject, 
            text: "Hey! verify your token", 
            html, 
          });
          const message = "Message sent: %s"+  info.messageId;
          logger(message ,'info');
    }
}
