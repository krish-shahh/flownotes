"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimulationCreator from '@/components/simulations/SimulationCreator';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, LogOut, FlaskConical, Menu } from 'lucide-react';
import { auth } from '@/lib/firebase'; // Make sure this path is correct
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LoadingSpinner } from '@/components/misc/LoadingSpinner';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'simulations'>('home');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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
    <div className="w-full h-screen flex">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[200px] sm:w-[240px]">
          <SidebarContent activeView={activeView} setActiveView={setActiveView} handleLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-col w-[200px] p-4 bg-gray-100">
        <SidebarContent activeView={activeView} setActiveView={setActiveView} handleLogout={handleLogout} />
      </div>

      <div className="flex-grow overflow-auto p-4">
        {activeView === 'home' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to FlowNotes</h1>
            <p>This is your dashboard. Select an option from the sidebar to get started.</p>
          </div>
        )}
        {activeView === 'simulations' && <SimulationCreator />}
      </div>
    </div>
  );
}

interface SidebarContentProps {
  activeView: 'home' | 'simulations';
  setActiveView: (view: 'home' | 'simulations') => void;
  handleLogout: () => void;
}

function SidebarContent({ activeView, setActiveView, handleLogout }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="text-2xl font-bold mb-8">FlowNotes</div>
      <nav className="space-y-4 flex-grow">
        <Button 
          variant={activeView === 'home' ? 'default' : 'ghost'} 
          className="w-full justify-start" 
          onClick={() => setActiveView('home')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button 
          variant={activeView === 'simulations' ? 'default' : 'ghost'} 
          className="w-full justify-start" 
          onClick={() => setActiveView('simulations')}
        >
          <FlaskConical className="mr-2 h-4 w-4" />
          Simulations
        </Button>
      </nav>
      <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}