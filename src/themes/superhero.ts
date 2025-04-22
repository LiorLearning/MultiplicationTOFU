import { GameTheme } from '../types/theme';

export const superheroTheme: GameTheme = {
  id: 'superhero',
  name: 'Superhero Championship',
  description: 'Join Flash in an epic battle against Loki across the multiverse!',
  
  colors: {
    primary: '#1E40AF',
    secondary: '#991B1B',
    accent: '#047857',
    background: '#000000',
  },
  
  player: {
    name: 'Flash',
    description: 'The fastest man alive, using his super-speed to solve mathematical puzzles.',
    avatar: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-class-images.s3.us-east-1.amazonaws.com%252FSandro%252F20250313_201207.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg',
    powers: ['Super Speed', 'Quick Thinking', 'Time Travel'],
  },
  
  villain: {
    name: 'Loki',
    description: 'The God of Mischief, using his cunning to create increasingly complex defensive formations.',
    avatar: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_174142_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg',
    powers: ['Shape-shifting', 'Illusion Magic', 'Super Intelligence'],
    personality: 'Sarcastic, cunning, and perpetually amused by the challenge',
    levelImages: [
      'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_174142_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg',
      'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_175053_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg',
      'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_175544_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg'
    ],
    dialogueStyle: 'Sarcastic and menacing, with references to the multiverse and time manipulation',
    dialogues: {
      defeat: [
        "Well well, Flash... Impressive. But my next defensive scheme will make your head spin faster than your super speed!",
        "Think you've mastered my defense? Time to introduce you to my elite squad. They're not just fast—they're quantum fast!",
        "Congratulations on the fluke, speedster! My next defensive line eats lightning for breakfast. Let's see you dance through that!",
      ],
      victory: [
        "Not so fast now, are you, Flash? My defense just rewrote the laws of physics—and your defeat!",
        "This is DELICIOUS! The fastest man alive, stopped dead in his tracks by MY defensive masterpiece!",
        "That's how you contain a speedster! Maybe try the minor leagues next time, Flash!",
      ],
      playerHit: [
        "Impressive read, Flash! But don't get cocky—my defense adapts faster than you run!",
        "Found a gap in my coverage? Enjoy it while it lasts, speedster!",
        "Nice play, Flash! But my defense? They're just warming up!",
      ],
      playerMiss: [
        "Too slow, Flash! My defense moves at the speed of mischief!",
        "Even the fastest man alive can't break through THIS coverage!",
        "Missed by a timeline, Flash! My defense is beyond your mortal calculations!",
      ],
    },
  },
  
  gameName: 'Multiplication Football Championship',
  backgroundImage: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_182540_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg',
  levelNames: ['Junior Varsity', 'Varsity', 'Pro League'],
  gameDescription: 'Use multiplication to break through Loki\'s defensive formations!',
  targetDescription: 'Find the defenders at coordinates that multiply to your target number!',
  
  voiceId: 'TxGEqnHWrfWFTfGW9XjX',
  
  music: {
    main: '/src/components/music1.mp3',
    victory: '/src/components/music2.mp3',
    defeat: '/src/components/music3.mp3',
  },
  
  ui: {
    hitMessage: 'Direct Hit!',
    missMessage: 'No defenders detected at those coordinates.',
    victoryMessage: 'Championship Victory!',
    defeatMessage: 'Game Over',
    levelUpMessage: 'Level Complete!',
  },
}