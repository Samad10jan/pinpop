import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});

export async function sendVerificationCode(email: string, otp: string) {
    await transporter.sendMail({
        from: `"PinPop" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify your Email",
        html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
    });
}

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendSignUpSucessMessage(email: string, otp: string) {
    await transporter.sendMail({
        from: `"Fixel" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Signup Successful",
        html: `
        <h2>Welcome to Fixel!</h2>
        <p>Your account has been created successfully.</p>
        <p>Feel free to explore and start pinning your favorite content!</p>
        <a href=${process.env.NEXT_PUBLIC_BASE_URL}>Go to Fixel</a>
    `,
    });
}