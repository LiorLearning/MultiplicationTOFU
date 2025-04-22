import { create } from 'zustand';
import { GameState, Ship, Attempt, Coordinate } from '../types';
import { defaultGameConfig } from '../config/gameConfig';
import { playSound } from '../utils/audio';

interface GameStore extends GameState {
  setGameState: (state: Partial<GameState>) => void;
  getRemainingShips: (board: GameState['board'], ships: Ship[]) => number;
  checkGameEnd: (attempts: Attempt[]) => { isGameOver: boolean; playerWon: boolean };
  initializeBoard: (level?: number) => void;
  cpuTurn: () => Promise<{ newAttempts: Attempt[]; targetShip: Ship } | null>;
  findMultiplicationCoordinates: (number: number) => Coordinate[];
}

const createInitialBoard = (rows: number, cols: number) => 
  Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({ 
      hasPlayerShip: false, 
      hasComputerShip: false, 
      isHit: false 
    }))
  );

const isEasyCoordinate = (row: number, col: number, level: number): boolean => {
  if (level === 1) return false;
  const maxValue = level === 3 ? 10 : 7;
  return row === 0 || row === 1 || row === maxValue - 1 || 
         col === 0 || col === 1 || (level === 3 && col === 9);
};

const isValidShipPlacement = (
  board: GameState['board'], 
  row: number, 
  col: number, 
  isPlayer: boolean,
  level: number
): boolean => {
  return !(
    board[row][col].hasPlayerShip || 
    board[row][col].hasComputerShip || 
    (!isPlayer && isEasyCoordinate(row, col, level))
  );
};

const placeShips = (rows: number, cols: number, playerCount: number, computerCount: number, level: number) => {
  const board = createInitialBoard(rows, cols);
  const playerShips: Ship[] = [];
  const computerShips: Ship[] = [];
  const MAX_PLACEMENT_ATTEMPTS = 100;

  const placeShip = (ships: Ship[], isPlayer: boolean) => {
    let attempts = 0;
    let coordinates;

    do {
      coordinates = {
        row: Math.floor(Math.random() * rows),
        col: Math.floor(Math.random() * cols)
      };
      attempts++;

      if (attempts > MAX_PLACEMENT_ATTEMPTS) break;
    } while (!isValidShipPlacement(board, coordinates.row, coordinates.col, isPlayer, level));
    
    const { row, col } = coordinates;
    if (isPlayer) {
      board[row][col].hasPlayerShip = true;
    } else {
      board[row][col].hasComputerShip = true;
    }
    ships.push({ row, col });
  };

  const actualPlayerCount = level === 3 ? 7 : playerCount;
  const actualComputerCount = level === 3 ? 6 : computerCount;

  Array(actualPlayerCount).fill(null).forEach(() => placeShip(playerShips, true));
  Array(actualComputerCount).fill(null).forEach(() => placeShip(computerShips, false));

  return { board, playerShips, computerShips };
};

export const useGameStore = create<GameStore>((set, get) => {
  const initialLevel = defaultGameConfig.levels[0];
  const { rows, cols } = initialLevel.boardSize;
  const { board, playerShips, computerShips } = placeShips(
    rows,
    cols,
    initialLevel.minShips.player,
    initialLevel.minShips.cpu,
    1
  );

  return {
    board,
    playerShips,
    computerShips,
    attempts: [],
    score: 0,
    userAnswer: '',
    targetValue: null,
    turnCount: 0,
    cpuTarget: null,
    level: 1,

    setGameState: (newState) => set((state) => ({ ...state, ...newState })),

    getRemainingShips: (board, ships) => {
      return ships.reduce((count, ship) => {
        const cell = board[ship.row]?.[ship.col];
        return count + (cell && !cell.isHit ? 1 : 0);
      }, 0);
    },

    checkGameEnd: (attempts) => {
      const state = get();
      const remainingPlayerShips = state.getRemainingShips(state.board, state.playerShips);
      const remainingComputerShips = state.getRemainingShips(state.board, state.computerShips);

      return {
        isGameOver: remainingPlayerShips === 0 || remainingComputerShips === 0,
        playerWon: remainingComputerShips === 0
      };
    },

    initializeBoard: (level = 1) => {
      const levelConfig = defaultGameConfig.levels.find(l => l.id === level) || defaultGameConfig.levels[0];
      const { rows, cols } = levelConfig.boardSize;
      const { board, playerShips, computerShips } = placeShips(
        rows,
        cols,
        levelConfig.minShips.player,
        levelConfig.minShips.cpu,
        level
      );

      playSound('buttonClick');

      set({
        board,
        playerShips,
        computerShips,
        attempts: [],
        score: level === 1 ? 0 : get().score,
        userAnswer: '',
        targetValue: null,
        turnCount: 0,
        cpuTarget: null,
        level,
      });
    },

    cpuTurn: async () => {
      const state = get();
      const remainingPlayerShips = state.playerShips.filter(ship => 
        !state.board[ship.row][ship.col].isHit
      );

      if (remainingPlayerShips.length > 0) {
        const targetShip = remainingPlayerShips[Math.floor(Math.random() * remainingPlayerShips.length)];
        
        set({ cpuTarget: targetShip });

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        playSound('hit');

        const newAttempts = [...state.attempts, { ...targetShip, isPlayerShip: true }];
        const newBoard = [...state.board];
        newBoard[targetShip.row][targetShip.col].isHit = true;

        set({
          board: newBoard,
          attempts: newAttempts,
          turnCount: state.turnCount + 1,
          cpuTarget: null,
        });

        return { newAttempts, targetShip };
      }
      return null;
    },

    findMultiplicationCoordinates: (number) => {
      const state = get();
      const coordinates: Coordinate[] = [];
      for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[0].length; col++) {
          if ((row + 1) * (col + 1) === number) {
            coordinates.push({ row, col });
          }
        }
      }
      return coordinates;
    },
  };
});