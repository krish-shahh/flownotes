"use client";

import React, { useState, useRef } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const sendSignInCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-signin-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setCodeSent(true);
        setError(null);
      } else {
        throw new Error('Failed to send sign-in code');
      }
    } catch (error) {
      console.error('Error sending sign-in code:', error);
      setError('Failed to send sign-in code. Please try again.');
    }
  };

  const verifySignInCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    try {
      const response = await fetch('/api/verify-signin-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      if (response.ok) {
        const { token } = await response.json();
        await signInWithCustomToken(auth, token);
        onLoginSuccess();
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      console.error('Error verifying sign-in code:', error);
      setError('Invalid code. Please try again.');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
    // Focus on the next empty input or the last input if all are filled
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={signInWithGoogle} className="w-full mb-4">Sign in with Google</Button>
        {!codeSent ? (
          <form onSubmit={sendSignInCode}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">Send Sign-In Code</Button>
          </form>
        ) : (
          <form onSubmit={verifySignInCode}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex justify-between">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 text-center"
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">Verify Code</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default Login;