import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    const user = await adminAuth.getUserByEmail(email);
    const customClaims = user.customClaims || {};

    if (customClaims.signInCode === code) {
      // Code is correct, create a custom token for the user
      const customToken = await adminAuth.createCustomToken(user.uid);
      
      // Clear the sign-in code
      await adminAuth.setCustomUserClaims(user.uid, { signInCode: null });

      return NextResponse.json({ token: customToken });
    } else {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying sign-in code:', error);
    return NextResponse.json({ error: 'Failed to verify sign-in code' }, { status: 500 });
  }
}