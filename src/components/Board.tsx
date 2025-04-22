import React from 'react';
import { GameState } from '../types';
import { defaultGameConfig } from '../config/gameConfig';

interface BoardProps {
  gameState: GameState;
  onCellSelect: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = ({ gameState }) => {
  const remainingPlayerShips = gameState.board.reduce((count, row, rowIndex) => 
    count + row.reduce((rowCount, cell, colIndex) => 
      rowCount + (gameState.playerShips.some(ship => 
        ship.row === rowIndex && 
        ship.col === colIndex && 
        !cell.isHit
      ) ? 1 : 0), 
    0), 
  0);

  const remainingComputerShips = gameState.board.reduce((count, row, rowIndex) => 
    count + row.reduce((rowCount, cell, colIndex) => 
      rowCount + (gameState.computerShips.some(ship => 
        ship.row === rowIndex && 
        ship.col === colIndex && 
        !cell.isHit
      ) ? 1 : 0), 
    0), 
  0);

  const currentLevel = defaultGameConfig.levels.find(l => l.id === gameState.level) || defaultGameConfig.levels[0];
  const { rows, cols } = currentLevel.boardSize;

  // Calculate cell size based on level
  const getCellSize = () => {
    if (rows <= 5 && cols <= 5) return 'w-24 h-24'; // Larger cells for small grids
    if (rows <= 5 && cols <= 10) return 'w-20 h-20'; // Medium cells for medium grids
    return 'w-16 h-16'; // Smaller cells for large grids
  };

  const cellSize = getCellSize();
  const headerSize = cellSize === 'w-24 h-24' ? 'w-24 h-24' : 
                    cellSize === 'w-20 h-20' ? 'w-20 h-20' : 
                    'w-16 h-16';

  // Calculate image size based on cell size
  const getImageSize = () => {
    if (cellSize === 'w-24 h-24') return 'w-20 h-20';
    if (cellSize === 'w-20 h-20') return 'w-16 h-16';
    return 'w-14 h-14';
  };

  const imageSize = getImageSize();

  // Find a real example for hitting Loki's defender
  const getExampleTarget = () => {
    // Find the first computer ship for an example
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hasComputerShip = gameState.computerShips.some(
          ship => ship.row === r && ship.col === c
        );
        if (hasComputerShip) {
          return {
            row: r + 1, // +1 because we display 1-based indices to users
            col: c + 1,
            product: (r + 1) * (c + 1)
          };
        }
      }
    }
    // Fallback to a simple example if no ships found
    return { row: 2, col: 3, product: 6 };
  };

  const exampleTarget = getExampleTarget();

  return (
    <div className="relative p-4 flex-1 flex flex-col items-center justify-center">
      <div className="text-center text-white text-6xl mb-4 font-bold shadow-text animate-slide-down bg-black/30 py-4 rounded-xl backdrop-blur-sm w-full">
        Multiplication Football
      </div>
      <div className="text-center mb-6 text-white animate-slide-up bg-black/30 py-4 px-6 rounded-xl backdrop-blur-sm w-full flex flex-col gap-2">
        <p className="text-2xl">
          Find the product of row × column coordinates to defeat Loki's defenders!
        </p>
        <p className="text-lg text-blue-300">
          Example: To hit Loki at Row {exampleTarget.row} × Column {exampleTarget.col}, enter <span className="font-bold text-yellow-300">{exampleTarget.product}</span>
        </p>
      </div>
      
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-col bg-[#2F7B1F]/40 p-4 rounded-3xl backdrop-blur-sm mx-auto">
          <div className="flex">
            <div className={headerSize} />
            {Array(cols).fill(null).map((_, i) => (
              <div 
                key={`col-${i}`} 
                className={`${headerSize} flex items-center justify-center font-bold text-3xl text-white shadow-text`}
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
                  className={`${headerSize} flex items-center justify-center font-bold text-3xl text-white shadow-text`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className={`grid gap-[2px]`} 
                 style={{ 
                   display: 'grid', 
                   gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                   gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                 }}>
              {gameState.board.slice(0, rows).map((row, rowIndex) => (
                row.slice(0, cols).map((cell, colIndex) => {
                  const playerShip = gameState.playerShips.find(ship => 
                    ship.row === rowIndex && ship.col === colIndex
                  );

                  const computerShip = gameState.computerShips.find(ship => 
                    ship.row === rowIndex && ship.col === colIndex
                  );

                  const isHit = cell.isHit;
                  const playerHit = isHit && playerShip;
                  const computerHit = isHit && computerShip;

                  const showPlayerShip = playerShip && !isHit;
                  const showComputerShip = computerShip && !isHit;

                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`${cellSize} bg-[#4CAF50]/10 border-2 ${
                        gameState.cpuTarget?.row === rowIndex && gameState.cpuTarget?.col === colIndex
                          ? 'border-red-500 animate-pulse'
                          : 'border-white/30'
                      } flex items-center justify-center relative transition-all duration-200 hover:bg-white/20`}
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0, rgba(76, 175, 80, 0.1) 1px, transparent 0, transparent 10px)',
                        backgroundSize: '14px 14px'
                      }}
                    >
                      {showPlayerShip && (
                        <img 
                          src={defaultGameConfig.player.assetUrl}
                          alt={`${defaultGameConfig.player.name}'s position`}
                          className={`absolute ${imageSize} object-cover rounded-full transition-transform duration-300 hover:scale-110`}
                        />
                      )}
                      {showComputerShip && (
                        <img 
                          src={currentLevel.cpuImage}
                          alt={`${defaultGameConfig.cpu.name}'s position`}
                          className={`absolute ${imageSize} object-cover rounded-full transition-transform duration-300 hover:scale-110`}
                        />
                      )}
                      {isHit && (
                        <div className={`absolute ${imageSize} rounded-full ${
                          playerHit ? 'bg-red-500/70 animate-pulse' : 
                          computerHit ? 'bg-yellow-300/70 animate-pulse' : 
                          'bg-gray-500/70'
                        } transition-all duration-300`} />
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center px-8 w-full">
        <div className="font-bold text-white text-3xl text-center shadow-text bg-black/30 px-6 py-3 rounded-xl backdrop-blur-sm">
          {defaultGameConfig.player.name}'s team: {remainingPlayerShips}
        </div>
        <div className="font-bold text-white text-3xl text-center shadow-text bg-black/30 px-6 py-3 rounded-xl backdrop-blur-sm">
          Defenders remaining: {remainingComputerShips}
        </div>
      </div>
    </div>
  );
}