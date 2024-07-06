import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    const user = await adminAuth.getUserByEmail(email);
    const customClaims = user.customClaims || {};

    const currentTime = new Date().getTime();

    if (customClaims.signInCode === code && customClaims.signInCodeExpiry > currentTime) {
      // Code is correct and not expired, create a custom token for the user
      const customToken = await adminAuth.createCustomToken(user.uid);

      // Clear the sign-in code and expiration time
      await adminAuth.setCustomUserClaims(user.uid, { signInCode: null, signInCodeExpiry: null });

      return NextResponse.json({ token: customToken });
    } else if (customClaims.signInCodeExpiry <= currentTime) {
      return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error verifying sign-in code:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify sign-in code';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
