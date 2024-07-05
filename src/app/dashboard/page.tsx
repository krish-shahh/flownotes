import Link from 'next/link';
import SimulationCreator from '@/components/simulations/SimulationCreator';
import { Button } from "@/components/ui/button";

export default function SimulationsPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            FlowNotes
          </Link>
          <Button asChild variant="ghost">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>
      <div className="flex-grow">
        <SimulationCreator />
      </div>
    </div>
  );
}