import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';
import { addMinutes } from 'date-fns';

function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const code = generateRandomCode();
    const expirationTime = addMinutes(new Date(), 10).getTime(); // Store as timestamp

    let user;
    try {
      user = await adminAuth.getUserByEmail(email);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/user-not-found') {
        // If the user doesn't exist, create a new user
        user = await adminAuth.createUser({
          email,
          emailVerified: false,
          password: Math.random().toString(36).slice(-8), // Generate a random password
          displayName: email.split('@')[0],
          disabled: false,
        });
      } else {
        throw error;
      }
    }

    // Store the code and expiration time in custom claims
    await adminAuth.setCustomUserClaims(user.uid, { signInCode: code, signInCodeExpiry: expirationTime });

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
      html: `<p>Your sign-in code is: <strong>${code}</strong></p><p>This code will expire in 10 minutes.</p>`,
    });

    return NextResponse.json({ message: 'Sign-in code sent successfully' });
  } catch (error: unknown) {
    console.error('Error sending sign-in code:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send sign-in code';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
