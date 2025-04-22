import { useState, useCallback } from 'react';
import { GameState, Ship, Attempt, Coordinate } from '../types';
import { defaultGameConfig } from '../config/gameConfig';
import { playSound } from '../utils/audio';

// Constants
const MAX_PLACEMENT_ATTEMPTS = 100;

// Helper functions
const getRandomDialogue = (dialogues: string[] | undefined): string => {
  if (!dialogues || dialogues.length === 0) return "...";
  return dialogues[Math.floor(Math.random() * dialogues.length)];
};

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

const generateRandomCoordinate = (rows: number, cols: number) => ({
  row: Math.floor(Math.random() * rows),
  col: Math.floor(Math.random() * cols)
});

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

  const placeShip = (ships: Ship[], isPlayer: boolean) => {
    let attempts = 0;
    let coordinates;

    do {
      coordinates = generateRandomCoordinate(rows, cols);
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

  // Adjust player and CPU ship counts for level 3
  const actualPlayerCount = level === 3 ? 7 : playerCount;
  const actualComputerCount = level === 3 ? 6 : computerCount;

  Array(actualPlayerCount).fill(null).forEach(() => placeShip(playerShips, true));
  Array(actualComputerCount).fill(null).forEach(() => placeShip(computerShips, false));

  return { board, playerShips, computerShips };
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const level = defaultGameConfig.levels[0];
    const { rows, cols } = level.boardSize;
    const { board, playerShips, computerShips } = placeShips(
      rows,
      cols,
      level.minShips.player,
      level.minShips.cpu,
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
    };
  });

  const getRemainingShips = useCallback((board: GameState['board'], ships: Ship[]): number => {
    return ships.reduce((count, ship) => {
      const cell = board[ship.row]?.[ship.col];
      return count + (cell && !cell.isHit ? 1 : 0);
    }, 0);
  }, []);

  const checkGameEnd = useCallback((attempts: Attempt[]) => {
    const remainingPlayerShips = getRemainingShips(gameState.board, gameState.playerShips);
    const remainingComputerShips = getRemainingShips(gameState.board, gameState.computerShips);

    return {
      isGameOver: remainingPlayerShips === 0 || remainingComputerShips === 0,
      playerWon: remainingComputerShips === 0
    };
  }, [gameState.board, gameState.playerShips, gameState.computerShips, getRemainingShips]);

  const initializeBoard = useCallback((level: number = 1) => {
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

    setGameState(prev => ({
      board,
      playerShips,
      computerShips,
      attempts: [],
      score: level === 1 ? 0 : prev.score,
      userAnswer: '',
      targetValue: null,
      turnCount: 0,
      cpuTarget: null,
      level,
    }));
  }, []);

  const cpuTurn = useCallback(async () => {
    const remainingPlayerShips = gameState.playerShips.filter(ship => 
      !gameState.board[ship.row][ship.col].isHit
    );

    if (remainingPlayerShips.length > 0) {
      const targetShip = remainingPlayerShips[Math.floor(Math.random() * remainingPlayerShips.length)];
      
      setGameState(prev => ({
        ...prev,
        cpuTarget: targetShip
      }));

      // Add delay to simulate targeting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Play hit sound for CPU's turn
      playSound('hit');

      const newAttempts = [...gameState.attempts, { ...targetShip, isPlayerShip: true }];
      const newBoard = [...gameState.board];
      newBoard[targetShip.row][targetShip.col].isHit = true;

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        attempts: newAttempts,
        turnCount: prev.turnCount + 1,
        cpuTarget: null,
      }));

      return { newAttempts, targetShip };
    }
    return null;
  }, [gameState]);

  const findMultiplicationCoordinates = useCallback((number: number): Coordinate[] => {
    const coordinates: Coordinate[] = [];
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[0].length; col++) {
        if ((row + 1) * (col + 1) === number) {
          coordinates.push({ row, col });
        }
      }
    }
    return coordinates;
  }, [gameState.board]);

  return {
    gameState,
    setGameState,
    getRemainingShips,
    checkGameEnd,
    initializeBoard,
    cpuTurn,
    findMultiplicationCoordinates,
  };
};