import { GameTheme } from '../types/theme';

export const spaceTheme: GameTheme = {
  id: 'space',
  name: 'Galactic Mathematics',
  description: 'Join Captain Nova in an epic space battle against the mysterious Dark Calculator!',
  
  colors: {
    primary: '#6366F1',
    secondary: '#7C3AED',
    accent: '#10B981',
    background: '#0F172A',
  },
  
  player: {
    name: 'Captain Nova',
    description: 'A brilliant space captain using mathematical precision to navigate through enemy defenses.',
    avatar: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1974&auto=format&fit=crop',
    powers: ['Quantum Calculation', 'Space-Time Navigation', 'Mathematical Intuition'],
  },
  
  villain: {
    name: 'Dark Calculator',
    description: 'An ancient AI that has taken control of the galaxy\'s defensive systems.',
    avatar: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1970&auto=format&fit=crop',
    powers: ['Algorithmic Defense', 'Neural Networks', 'Quantum Computing'],
    personality: 'Cold, calculating, and fascinated by mathematical patterns',
    levelImages: [
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1970&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451187863213-d1bcbaae3fa3?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2027&auto=format&fit=crop',
    ],
    dialogueStyle: 'Analytical and machine-like, with references to calculations and algorithms',
    dialogues: {
      defeat: [
        "Calculating new defense matrices. Your mathematical prowess is... unexpected, Captain.",
        "Fascinating. My algorithms predicted only a 0.01% chance of breach. Recalibrating defenses.",
        "Your mathematical skills exceed my predictions. Initiating advanced defensive protocols.",
      ],
      victory: [
        "Calculation complete: Your defeat was mathematically inevitable, Captain.",
        "Your mathematical errors have led to your downfall. As my algorithms predicted.",
        "The numbers never lie, Captain. Your strategy had a fatal mathematical flaw.",
      ],
      playerHit: [
        "Impressive calculation. But my defensive algorithms are self-improving.",
        "A precise hit. But can you solve the next mathematical puzzle?",
        "Your mathematical accuracy is noted. Adapting defense patterns.",
      ],
      playerMiss: [
        "Incorrect calculation detected. My defenses remain optimal.",
        "Mathematical error detected. Recommend recalibrating your approach.",
        "Your calculations were imprecise. My defense grid remains intact.",
      ],
    },
  },
  
  gameName: 'Galactic Mathematics',
  backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2027&auto=format&fit=crop',
  levelNames: ['Asteroid Belt', 'Nebula Zone', 'Quantum Realm'],
  gameDescription: 'Use multiplication to break through the Dark Calculator\'s defense grid!',
  targetDescription: 'Target defense nodes at coordinates that multiply to your chosen number!',
  
  voiceId: 'onwK4e9ZLuTAKqWW5ps1',
  
  music: {
    main: '/src/components/music1.mp3',
    victory: '/src/components/music2.mp3',
    defeat: '/src/components/music3.mp3',
  },
  
  ui: {
    hitMessage: 'Defense Node Breached!',
    missMessage: 'Defense Grid Intact',
    victoryMessage: 'Galaxy Secured!',
    defeatMessage: 'Mission Failed',
    levelUpMessage: 'Sector Cleared!',
  },
}