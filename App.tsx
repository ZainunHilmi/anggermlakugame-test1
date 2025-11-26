
import React, { useState, useEffect, useCallback } from 'react';
import { GameView } from './components/GameView';
import { UIOverlay } from './components/UIOverlay';
import { MainMenu } from './components/MainMenu';
import { SettingsMenu } from './components/SettingsMenu';
import { LoadingScreen } from './components/LoadingScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { LEVELS } from './data/levels';
import { CheckCircle2 } from 'lucide-react';
import { Node } from './types';

type AppScreen = 'MENU' | 'SETTINGS' | 'LOADING' | 'GAME' | 'GAMEOVER';

// BFS Helper to find the next step towards the goal
const findNextStep = (startId: string, endId: string, nodes: Node[]): string | null => {
  if (startId === endId) return null;

  // Queue stores [currentNodeId, pathArray]
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    
    if (id === endId) {
      // Return the second node in the path (index 1) because index 0 is the start
      return path.length > 1 ? path[1] : null;
    }

    const node = nodes.find(n => n.id === id);
    if (node) {
      for (const neighborId of node.neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ id: neighborId, path: [...path, neighborId] });
        }
      }
    }
  }
  return null;
};

export default function App() {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('MENU');
  
  // Game State
  const [levelIndex, setLevelIndex] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState<string>(LEVELS[0].startNodeId);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentLevel = LEVELS[levelIndex];

  // Reset state when level changes
  useEffect(() => {
    setCurrentNodeId(currentLevel.startNodeId);
    setIsCompleted(false);
  }, [currentLevel, levelIndex]);

  // Check win condition
  useEffect(() => {
    if (currentNodeId === currentLevel.endNodeId && !isCompleted) {
      // Delay completion to allow spring animation to finish (approx 800ms-1000ms)
      // This ensures the player is VISUALLY on the block before the modal appears.
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentNodeId, currentLevel, isCompleted]);

  const handleNodeClick = useCallback((clickedNodeId: string) => {
    if (isCompleted) return;
    const currentNode = currentLevel.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;
    if (currentNode.neighbors.includes(clickedNodeId)) {
      setCurrentNodeId(clickedNodeId);
    }
  }, [currentLevel, currentNodeId, isCompleted]);

  // Hint / Auto-Step Feature
  const handleHint = () => {
    if (isCompleted) return;
    
    const nextStepId = findNextStep(currentNodeId, currentLevel.endNodeId, currentLevel.nodes);
    if (nextStepId) {
      setCurrentNodeId(nextStepId);
    }
  };

  const handleNextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      // All levels done
      setCurrentScreen('GAMEOVER');
    }
  };

  const handlePrevLevel = () => {
    if (levelIndex > 0) {
      setLevelIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(currentLevel.startNodeId);
    setIsCompleted(false);
  };

  // Screen Navigation Handlers
  const startLoading = () => {
    setLevelIndex(0); // Start from beginning
    setCurrentScreen('LOADING');
  } 
  const startGame = () => setCurrentScreen('GAME');
  const openSettings = () => setCurrentScreen('SETTINGS');
  const goToMenu = () => setCurrentScreen('MENU');

  return (
    <div className="w-screen h-screen bg-neutral-100 relative font-sans overflow-hidden select-none">
      
      {/* Screen Router */}
      {currentScreen === 'MENU' && (
        <MainMenu onPlay={startLoading} onSettings={openSettings} />
      )}

      {currentScreen === 'SETTINGS' && (
        <SettingsMenu onBack={goToMenu} />
      )}

      {currentScreen === 'LOADING' && (
        <LoadingScreen onComplete={startGame} />
      )}

      {currentScreen === 'GAMEOVER' && (
        <GameOverScreen 
          onRetry={() => {
            setLevelIndex(0);
            setCurrentScreen('GAME');
          }} 
          onMenu={goToMenu} 
        />
      )}

      {currentScreen === 'GAME' && (
        <div className="w-full h-full relative animate-in fade-in duration-700">
          <GameView 
            level={currentLevel} 
            currentNodeId={currentNodeId} 
            onNodeClick={handleNodeClick}
            windowSize={windowSize}
          />

          <UIOverlay 
            currentLevel={currentLevel}
            totalLevels={LEVELS.length}
            levelIndex={levelIndex}
            onReset={handleReset}
            onNext={handleNextLevel}
            onPrev={handlePrevLevel}
            onExit={goToMenu}
            onHint={handleHint}
          />

          {/* Level Complete Modal */}
          {isCompleted && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-sm w-full mx-4">
                <div className="text-green-500 mb-4 bg-green-50 p-4 rounded-full">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Cleared!</h2>
                <p className="text-neutral-500 mb-8 text-center">Visual anomaly resolved.</p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={handleNextLevel}
                    className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-neutral-800 transition-transform hover:scale-[1.02]"
                  >
                    {levelIndex === LEVELS.length - 1 ? "FINISH GAME" : "NEXT LEVEL"}
                  </button>
                  <button 
                    onClick={goToMenu}
                    className="w-full bg-transparent text-neutral-500 py-3 font-semibold hover:text-neutral-800 transition-colors"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
