export interface Cell {
  hasPlayerShip: boolean;
  hasComputerShip: boolean;
  isHit: boolean;
}

export interface Ship {
  row: number;
  col: number;
}

export interface Attempt {
  row: number;
  col: number;
  isPlayerShip: boolean;
}

export interface Coordinate {
  row: number;
  col: number;
}

export interface GameState {
  board: Cell[][];
  playerShips: Ship[];
  computerShips: Ship[];
  attempts: Attempt[];
  score: number;
  userAnswer: string;
  targetValue: number | null;
  turnCount: number;
  cpuTarget: Coordinate | null;
  level: number;
}

export interface MessageState {
  title: string;
  text: string;
  buttonText: string;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  isLevelUp?: boolean;
  nextLevel?: number;
  finalVictoryImage?: string;
  onClose?: () => void;
  onShow?: () => void;
  showChat?: boolean;
}

export interface CharacterConfig {
  name: string;
  assetUrl: string;
  color: string;
  dialogues?: {
    hit?: string[];
    defeat?: string[];
    victory?: string[];
    playerHit?: string[];
    playerMiss?: string[];
  };
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  maxNumber: number;
  minShips: {
    player: number;
    cpu: number;
  };
  boardSize: {
    rows: number;
    cols: number;
  };
  cpuImage: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface GameConfig {
  player: CharacterConfig;
  cpu: CharacterConfig;
  sidekick: CharacterConfig;
  backgroundUrl: string;
  levels: LevelConfig[];
  music: MusicTrack[];
}