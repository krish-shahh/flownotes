// components/dashboard/DashboardPage.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, LogOut, FlaskConical, Settings, ChevronDown, Plus, Search, FileText  } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { LoadingSpinner } from '@/components/misc/LoadingSpinner';
import SimulationCreator from '@/components/simulations/SimulationCreator';
import FromSettingsView from '@/components/SettingsView';
import NoteEditor from '@/components/notes/NodeEditor';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'home' | 'simulations' | 'settings'>('home');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">FlowNotes</h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          <SidebarContent activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveView('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ChevronDown className="h-4 w-4 mr-2" />
              All Notes
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-8" placeholder="Search" />
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeView === 'home' && <HomeView />}
          {activeView === 'simulations' && <SimulationsView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  activeView: 'home' | 'simulations' | 'settings';
  setActiveView: (view: 'home' | 'simulations' | 'settings') => void;
}

function SidebarContent({ activeView, setActiveView }: SidebarContentProps) {
  return (
    <nav className="space-y-1 p-4">
      <Button 
        variant={activeView === 'home' ? 'secondary' : 'ghost'} 
        className="w-full justify-start" 
        onClick={() => setActiveView('home')}
      >
        <FileText className="mr-2 h-4 w-4" />
        Notes
      </Button>
      <Button 
        variant={activeView === 'simulations' ? 'secondary' : 'ghost'} 
        className="w-full justify-start" 
        onClick={() => setActiveView('simulations')}
      >
        <FlaskConical className="mr-2 h-4 w-4" />
        Simulations
      </Button>
      {/* Add more sidebar items here */}
    </nav>
  );
}

function HomeView() {
  return (
    <NoteEditor />
  );
}

function SimulationsView() {
  return (
    <SimulationCreator />
  );
}

function SettingsView() {
  return (
    <div>
      <FromSettingsView />
    </div>
  );
}
