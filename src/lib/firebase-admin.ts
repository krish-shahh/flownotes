import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not a valid JSON string');
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();