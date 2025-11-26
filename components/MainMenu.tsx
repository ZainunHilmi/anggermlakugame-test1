import React from 'react';
import { Play, Settings, Box } from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onSettings }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAE5DC] z-50">
      <div className="relative mb-12 group cursor-default">
        <div className="absolute -inset-4 bg-neutral-300/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Box size={80} strokeWidth={1} className="text-neutral-800 relative z-10 animate-pulse" />
      </div>
      
      <h1 className="text-6xl font-bold tracking-tighter text-neutral-800 mb-2">Angger Mlaku</h1>
      <p className="text-neutral-500 tracking-widest uppercase text-xs mb-16">Impossible Perspective Puzzle</p>

      <div className="flex flex-col gap-4 w-64">
        <button 
          onClick={onPlay}
          className="flex items-center justify-center gap-3 py-4 bg-neutral-900 text-white rounded-xl shadow-xl hover:bg-neutral-800 hover:scale-[1.02] transition-all duration-200"
        >
          <Play size={20} fill="currentColor" />
          <span className="font-bold tracking-wide">PLAY</span>
        </button>

        <button 
          onClick={onSettings}
          className="flex items-center justify-center gap-3 py-4 bg-white text-neutral-800 border border-neutral-200 rounded-xl shadow-sm hover:bg-neutral-50 hover:scale-[1.02] transition-all duration-200"
        >
          <Settings size={20} />
          <span className="font-medium tracking-wide">SETTINGS</span>
        </button>
      </div>
      
      <div className="absolute bottom-8 text-neutral-400 text-xs font-mono">
        v1.2.0 • STUDIO ISO
      </div>
    </div>
  );
};