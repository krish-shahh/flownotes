"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
      <Login onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;