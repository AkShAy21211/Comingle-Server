import nodemailer from "nodemailer";
import IMail from "../../domain/interfaces/email/IMail";
import dotenv from "dotenv"
import path from 'path';

dotenv.config({path:path.resolve(__dirname,"../../../.env")});

class NodeMailer implements IMail {
  private _transporter: nodemailer.Transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.APP_PASS,
      },
    });
  }

  async sendEmail(to: string, otp: number,subject:string): Promise<any> {
   
    let mailOptions = {
      from: {
        name: 'Comingle Team',
        address: process.env.GMAIL_ID || ""
      },
      to: to,
      subject: subject,
      html: `
        <h2>${subject}</h2>
        <p>Dear User,</p>
        <p>Your One Time Password (OTP) for verifying your Commingle account is: <strong style="font-size:15px">${otp}</strong></p>
        <p>Please use this OTP to complete the verification process.</p>
        <img src="" alt="Commingle Logo">
        <p>Thank you,</p>
        <p>Commingle Team</p>
      `
    };

    try {
      const info = await this._transporter.sendMail(mailOptions);
      console.log("Email has been sent", info.response);
    } catch (error) {
      console.log("Error occurred when sending OTP mail", error);
  
    }
  }
}

export default NodeMailer;
