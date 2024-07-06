import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const code = generateRandomCode();
    
    // Store the code in Firebase Authentication custom claims
    await adminAuth.getUserByEmail(email)
      .then((user) => {
        return adminAuth.setCustomUserClaims(user.uid, { signInCode: code });
      })
      .catch(() => {
        // If the user doesn't exist, create a new user
        return adminAuth.createUser({ email })
          .then((user) => adminAuth.setCustomUserClaims(user.uid, { signInCode: code }));
      });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
    });

    // Send email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: 'FlowNotes Sign-In Code',
      html: `<p>Your sign-in code is: <strong>${code}</strong></p><p>This code will expire in 15 minutes.</p>`,
    });

    return NextResponse.json({ message: 'Sign-in code sent successfully' });
  } catch (error) {
    console.error('Error sending sign-in code:', error);
    return NextResponse.json({ error: 'Failed to send sign-in code' }, { status: 500 });
  }
}