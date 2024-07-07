"use client";

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LoadingSpinner } from '@/components/misc/LoadingSpinner';

const SettingsView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <LoadingSpinner className="w-12 h-12 text-primary" />;
  }

  const creationTime = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString()
    : 'Not available';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Email</h3>
          <p>{user.email}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Account Created</h3>
          <p>{creationTime}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">User ID</h3>
          <p className="break-all">{user.uid}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;