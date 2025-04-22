import React, { memo } from 'react';
import { GameState } from '../types';
import { defaultGameConfig } from '../config/gameConfig';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = memo<GameBoardProps>(({ gameState }) => {
  const currentLevel = defaultGameConfig.levels.find(l => l.id === gameState.level) || defaultGameConfig.levels[0];
  const { rows, cols } = currentLevel.boardSize;

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cell = gameState.board[rowIndex][colIndex];
    const playerShip = gameState.playerShips.find(ship => 
      ship.row === rowIndex && ship.col === colIndex
    );
    const computerShip = gameState.computerShips.find(ship => 
      ship.row === rowIndex && ship.col === colIndex
    );
    const isHit = cell.isHit;
    const showPlayerShip = playerShip && !isHit;
    const showComputerShip = computerShip && !isHit;

    return (
      <div
        key={`cell-${rowIndex}-${colIndex}`}
        className={`w-16 h-16 bg-white/10 border-2 ${
          gameState.cpuTarget?.row === rowIndex && gameState.cpuTarget?.col === colIndex
            ? 'border-red-500 animate-pulse'
            : 'border-white/30'
        } flex items-center justify-center relative transition-all duration-200 hover:bg-white/20`}
      >
        {showPlayerShip && (
          <img 
            src={defaultGameConfig.player.assetUrl}
            alt={`${defaultGameConfig.player.name}'s ship`}
            className="absolute w-14 h-14 object-contain transition-transform duration-300 hover:scale-110"
          />
        )}
        {showComputerShip && (
          <img 
            src={defaultGameConfig.cpu.assetUrl}
            alt={`${defaultGameConfig.cpu.name}'s ship`}
            className="absolute w-14 h-14 object-contain transition-transform duration-300 hover:scale-110"
          />
        )}
        {isHit && (
          <div className={`absolute w-12 h-12 rounded-full ${
            isHit && playerShip ? 'bg-red-500/70 animate-pulse' : 
            isHit && computerShip ? 'bg-yellow-300/70 animate-pulse' : 
            'bg-gray-500/70'
          } transition-all duration-300`} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-black/40 p-4 rounded-3xl backdrop-blur-sm">
      <div className="flex">
        <div className="w-16 h-16" />
        {Array(cols).fill(null).map((_, i) => (
          <div 
            key={`col-${i}`} 
            className="w-16 h-16 flex items-center justify-center font-bold text-2xl text-white shadow-text"
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="flex">
        <div className="flex flex-col">
          {Array(rows).fill(null).map((_, i) => (
            <div 
              key={`row-${i}`} 
              className="w-16 h-16 flex items-center justify-center font-bold text-2xl text-white shadow-text"
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="grid" 
             style={{ 
               display: 'grid', 
               gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
               gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
               gap: '2px'
             }}>
          {gameState.board.slice(0, rows).map((row, rowIndex) => 
            row.slice(0, cols).map((_, colIndex) => renderCell(rowIndex, colIndex))
          )}
        </div>
      </div>
    </div>
  );
});

GameBoard.displayName = 'GameBoard';