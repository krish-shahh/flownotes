'use client';

import NextImage from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

type FeatureName = 'Notes' | 'Mind Maps' | 'Simulations' | 'Templates' | 'File Management';

interface ProductFeature {
  name: FeatureName;
  icon: string;
  screenshot: string;
}

const productFeatures: ProductFeature[] = [
  { name: 'Notes', icon: '/icons/notes-icon.svg', screenshot: '/gifs/notes-demo.gif' },
  { name: 'Mind Maps', icon: '/icons/note-webs-icon.svg', screenshot: '/gifs/mind-maps-demo.gif' },
  { name: 'Simulations', icon: '/icons/simulations-icon.svg', screenshot: '/gifs/simulations-demo.gif' },
  { name: 'Templates', icon: '/icons/templates-icon.svg', screenshot: '/gifs/templates-demo.gif' },
  { name: 'File Management', icon: '/icons/files-icon.svg', screenshot: '/gifs/file-management-demo.gif' },
];

export function ProductNavigation() {
  const [activeFeature, setActiveFeature] = useState<ProductFeature>(productFeatures[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const img = new window.Image();
    img.onload = () => setIsLoading(false);
    img.src = activeFeature.screenshot;
  }, [activeFeature]);

  return (
    <div className="mt-16">
      <div className="flex justify-center space-x-8 mb-8">
        {productFeatures.map((feature) => (
          <button
            key={feature.name}
            className={`flex flex-col items-center ${activeFeature.name === feature.name ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setActiveFeature(feature)}
          >
            <NextImage src={feature.icon} alt={feature.name} width={24} height={24} />
            <span className="mt-2 text-sm">{feature.name}</span>
          </button>
        ))}
      </div>
      <div className="relative w-full max-w-4xl mx-auto h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <NextImage
          src={activeFeature.screenshot}
          alt={`${activeFeature.name} demo`}
          fill
          style={{ objectFit: 'contain', opacity: isLoading ? 0 : 1 }}
          unoptimized={true}
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{activeFeature.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{getFeatureDescription(activeFeature.name)}</p>
      </div>
    </div>
  );
}

function getFeatureDescription(featureName: FeatureName): string {
  switch (featureName) {
    case 'Notes':
      return "Create and organize your notes with our powerful rich text editor.";
    case 'Mind Maps':
      return "Visualize your notes as interconnected nodes for better understanding and idea linking.";
    case 'Simulations':
      return "Run and create simulations directly within your notes to bring concepts to life.";
    case 'Templates':
      return "Use and create templates to streamline your note-taking process.";
    case 'File Management':
      return "Easily upload, organize, and link files to your notes and simulations.";
    default:
      return "";
  }
}