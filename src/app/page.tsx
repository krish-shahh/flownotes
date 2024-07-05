import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ProductNavigation } from "@/components/ProductNavigation";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">FlowNotes</div>
          <div>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 mr-4">
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to FlowNotes
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Enhance your note-taking experience with integrated simulations and interconnected note webs.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>

        <ProductNavigation />
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 FlowNotes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;