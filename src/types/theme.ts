export interface GameTheme {
  id: string;
  name: string;
  description: string;
  
  // Visual theming
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  
  // Characters
  player: {
    name: string;
    description: string;
    avatar: string;
    powers?: string[];
  };
  
  villain: {
    name: string;
    description: string;
    avatar: string;
    powers?: string[];
    personality: string;
    levelImages: string[];
    dialogueStyle: string;
    dialogues: {
      defeat: string[];
      victory: string[];
      playerHit: string[];
      playerMiss: string[];
    };
  };
  
  // Game specific
  gameName: string;
  backgroundImage: string;
  levelNames: string[];
  gameDescription: string;
  targetDescription: string;
  
  // Audio
  voiceId?: string;
  music: {
    main: string;
    victory: string;
    defeat: string;
  };
  
  // UI text customization
  ui: {
    hitMessage: string;
    missMessage: string;
    victoryMessage: string;
    defeatMessage: string;
    levelUpMessage: string;
  };
}

export interface ThemeConfig {
  themes: GameTheme[];
  defaultTheme: string;
}