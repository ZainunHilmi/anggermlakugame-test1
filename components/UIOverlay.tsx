import React, { useState } from 'react';
import { RefreshCw, ChevronRight, ChevronLeft, Pause, Play, Home, Menu, Lightbulb } from 'lucide-react';
import { LevelData } from '../types';

interface UIOverlayProps {
  currentLevel: LevelData;
  totalLevels: number;
  levelIndex: number;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onHint: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  currentLevel,
  totalLevels,
  levelIndex,
  onReset,
  onNext,
  onPrev,
  onExit,
  onHint,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePauseToggle = () => setIsPaused(!isPaused);

  return (
    <>
      {/* Main HUD */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 transition-opacity duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className={`pointer-events-auto transition-opacity duration-300 ${isPaused ? 'opacity-0' : 'opacity-100'}`}>
              <h1 className="text-2xl font-bold tracking-tighter text-neutral-800">Angger Mlaku</h1>
              <p className="text-sm text-neutral-500 mt-1">Level {levelIndex + 1}: {currentLevel.name}</p>
          </div>
          
          <button 
              onClick={handlePauseToggle}
              className="pointer-events-auto p-3 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors text-neutral-800 z-20"
          >
              {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} />}
          </button>
        </div>

        {/* Footer Controls */}
        <div className={`flex justify-between items-end transition-opacity duration-300 ${isPaused ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex gap-3">
            <button 
                onClick={onReset}
                className="pointer-events-auto p-3 bg-white rounded-full shadow-md hover:bg-neutral-50 text-neutral-600"
                title="Reset Level"
            >
                <RefreshCw size={20} />
            </button>
            
            <button 
                onClick={onHint}
                className="pointer-events-auto p-3 bg-white rounded-full shadow-md hover:bg-yellow-50 text-yellow-500 border border-transparent hover:border-yellow-200 transition-colors"
                title="Hint / Step Forward"
            >
                <Lightbulb size={20} />
            </button>
          </div>

          <div className="flex gap-2 pointer-events-auto">
              <button 
                  onClick={onPrev}
                  disabled={levelIndex === 0}
                  className="p-3 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  <ChevronLeft size={24} />
              </button>
              <button 
                  onClick={onNext}
                  disabled={levelIndex === totalLevels - 1}
                  className="p-3 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  <ChevronRight size={24} />
              </button>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in fade-in duration-200">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 tracking-tight">PAUSED</h2>
          
          <div className="flex flex-col gap-4 w-48">
            <button 
              onClick={handlePauseToggle} 
              className="flex items-center justify-center gap-3 py-3 bg-neutral-900 text-white rounded-xl shadow-lg hover:bg-neutral-800 transition-transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              <span className="font-bold text-sm">RESUME</span>
            </button>
            
            <button 
              onClick={() => { onReset(); setIsPaused(false); }}
              className="flex items-center justify-center gap-3 py-3 bg-white border border-neutral-200 text-neutral-800 rounded-xl shadow-sm hover:bg-neutral-50 transition-transform hover:scale-105"
            >
              <RefreshCw size={18} />
              <span className="font-bold text-sm">RETRY</span>
            </button>

            <button 
              onClick={onExit}
              className="flex items-center justify-center gap-3 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl shadow-sm hover:bg-red-100 transition-transform hover:scale-105 mt-4"
            >
              <Home size={18} />
              <span className="font-bold text-sm">EXIT</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};