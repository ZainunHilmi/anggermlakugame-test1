
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200); // Small delay after 100%
          return 100;
        }
        // Randomize increment for "realistic" loading feel
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-[60] text-white">
      <div className="w-64 mb-8">
        <div className="flex justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>LOADING ASSETS</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-white transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>
    </div>
  );
};
