
import React, { useState } from 'react';
import { ChevronLeft, Volume2, VolumeX, Smartphone, Eye } from 'lucide-react';

interface SettingsMenuProps {
  onBack: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack }) => {
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const ToggleItem = ({ label, icon: Icon, value, onChange }: any) => (
    <div 
        onClick={() => onChange(!value)}
        className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-neutral-200 cursor-pointer hover:border-neutral-300 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${value ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
            <Icon size={24} />
        </div>
        <span className="font-medium text-neutral-700 text-lg">{label}</span>
      </div>
      <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${value ? 'bg-green-500' : 'bg-neutral-200'}`}>
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-[#EAE5DC] z-50 animate-in slide-in-from-right duration-300">
      <div className="p-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-sm hover:bg-neutral-50 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-neutral-800">Settings</h2>
      </div>

      <div className="flex-1 px-8 flex flex-col gap-4 max-w-md mx-auto w-full">
        <ToggleItem 
            label="Sound Effects" 
            icon={sound ? Volume2 : VolumeX} 
            value={sound} 
            onChange={setSound} 
        />
        <ToggleItem 
            label="Haptic Feedback" 
            icon={Smartphone} 
            value={haptics} 
            onChange={setHaptics} 
        />
         <ToggleItem 
            label="High Contrast" 
            icon={Eye} 
            value={highContrast} 
            onChange={setHighContrast} 
        />
      </div>
      
      <div className="p-8 text-center text-neutral-400 text-sm">
        Settings are saved automatically.
      </div>
    </div>
  );
};
