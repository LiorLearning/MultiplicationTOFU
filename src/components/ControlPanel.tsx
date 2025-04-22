import React from 'react';
import { GameState } from '../types';
import { Target, Crosshair, Swords } from 'lucide-react';
import { defaultGameConfig } from '../config/gameConfig';

interface ControlPanelProps {
  gameState: GameState;
  onNumpadInput: (value: string) => void;
  onFire: () => void;
  onClear: () => void;
  onLevelSelect: (level: number) => void;
  playerName?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  onNumpadInput,
  onFire,
  onClear,
  onLevelSelect,
  playerName = '',
}) => {
  const currentLevel = defaultGameConfig.levels.find(l => l.id === gameState.level) || defaultGameConfig.levels[0];

  return (
    <div className="w-[30%] bg-black/60 backdrop-blur-sm p-6 flex flex-col items-center rounded-r-3xl">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 flex items-center justify-center mb-2">
            <img 
              src={defaultGameConfig.player.assetUrl} 
              alt={defaultGameConfig.player.name}
              className="w-full h-full object-cover mix-blend-luminosity brightness-110 contrast-110"
            />
          </div>
          <div className="text-white font-bold text-xl">{defaultGameConfig.player.name}</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Swords className="w-12 h-12 text-red-500 mb-2 animate-pulse" />
          <div className="text-white font-bold text-3xl">VS</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 flex items-center justify-center mb-2">
            <img 
              src={currentLevel.cpuImage} 
              alt={defaultGameConfig.cpu.name}
              className="w-full h-full object-contain mix-blend-luminosity brightness-110 contrast-110"
            />
          </div>
          <div className="text-white font-bold text-xl">{defaultGameConfig.cpu.name}</div>
        </div>
      </div>

      {/* Coach display with player name */}
      {playerName && (
        <div className="w-full mb-6 bg-blue-900/30 p-3 rounded-xl text-center">
          <div className="text-white text-lg font-bold">
            Coach: <span className="text-blue-400">{playerName}</span>
          </div>
        </div>
      )}

      <div className="w-full mb-6">
        <div className="text-white text-xl mb-2">Select Level:</div>
        <div className="grid grid-cols-3 gap-3">
          {defaultGameConfig.levels.map((level) => (
            <button
              key={level.id}
              onClick={() => onLevelSelect(level.id)}
              className={`p-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105
                ${gameState.level === level.id ? 'bg-white/30' : 'bg-black/30'}`}
            >
              <div className="text-lg">{level.name}</div>
              <div className="text-xs mt-1 opacity-75">
                {level.boardSize.rows}×{level.boardSize.cols} Grid
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[40px] mb-4 font-bold text-2xl text-center text-white shadow-text">
        Enter target coordinates
      </div>

      <div className="w-full h-[70px] bg-black/30 rounded-xl mb-6 flex items-center justify-center text-white text-6xl font-bold shadow-lg backdrop-blur-sm">
        {gameState.userAnswer || '?'}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 w-full">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
          <button
            key={num}
            className="h-[60px] bg-black/30 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg backdrop-blur-sm
              hover:bg-white/20 active:bg-white/30 transform transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => onNumpadInput(num.toString())}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        className="w-full h-[70px] rounded-xl text-white text-4xl font-bold mb-4 shadow-lg
          hover:brightness-110 active:brightness-90 transform transition-all duration-200 hover:scale-105 active:scale-95
          flex items-center justify-center gap-4"
        style={{ backgroundColor: defaultGameConfig.cpu.color }}
        onClick={onFire}
      >
        <Target className="w-10 h-10" />
        FIRE
      </button>

      <button
        className="w-full h-[50px] bg-black/30 rounded-xl text-2xl font-bold text-white shadow-lg backdrop-blur-sm
          hover:bg-white/20 active:bg-white/30 transform transition-all duration-200 hover:scale-105 active:scale-95
          flex items-center justify-center gap-4"
        onClick={onClear}
      >
        <Crosshair className="w-7 h-7" />
        CLEAR
      </button>
    </div>
  );
}