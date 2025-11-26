
import React from 'react';
import { RotateCcw, Home } from 'lucide-react';

interface GameOverScreenProps {
  onRetry: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRetry, onMenu }) => {
  return (
    <div className="absolute inset-0 bg-[#EAE5DC] flex flex-col items-center justify-center overflow-hidden z-50 animate-in fade-in duration-1000">
      
      {/* Background Geometric Illusion */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] flex items-center justify-center">
        <svg width="600" height="600" viewBox="0 0 200 200" className="animate-[spin_20s_linear_infinite]">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          
          {/* Wireframe Impossible Cube-like structure */}
          <g transform="translate(100,100)" stroke="currentColor" strokeWidth="1" fill="none">
             {/* Outer Hexagon */}
             <path d="M0 -50 L43.3 -25 L43.3 25 L0 50 L-43.3 25 L-43.3 -25 Z" />
             
             {/* Inner Cube Lines */}
             <path d="M0 -50 L0 0" />
             <path d="M43.3 -25 L0 0" />
             <path d="M-43.3 -25 L0 0" />
             
             {/* Offset "Ghost" Geometry for illusion effect */}
             <g transform="scale(0.6) rotate(180)">
                <path d="M0 -50 L43.3 -25 L43.3 25 L0 50 L-43.3 25 L-43.3 -25 Z" />
                <path d="M0 -50 L0 0" />
                <path d="M43.3 -25 L0 0" />
                <path d="M-43.3 -25 L0 0" />
             </g>
          </g>
          
          {/* Decorative Circles */}
          <circle cx="100" cy="100" r="80" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="60" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center">
        <div className="mb-2 w-16 h-[1px] bg-neutral-400"></div>
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-800 tracking-[0.25em] ml-4 mb-2">GAME</h1>
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-800 tracking-[0.25em] ml-4 mb-12">OVER</h1>
        <div className="mb-16 w-16 h-[1px] bg-neutral-400"></div>

        <div className="flex gap-12">
          <button 
            onClick={onRetry}
            className="group flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <div className="p-4 border border-neutral-300 rounded-full group-hover:border-neutral-900 group-hover:scale-110 transition-all duration-300">
              <RotateCcw size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs uppercase tracking-widest font-medium">Retry</span>
          </button>

          <button 
            onClick={onMenu}
            className="group flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
             <div className="p-4 border border-neutral-300 rounded-full group-hover:border-neutral-900 group-hover:scale-110 transition-all duration-300">
              <Home size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs uppercase tracking-widest font-medium">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
