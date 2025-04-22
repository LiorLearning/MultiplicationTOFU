import { GameConfig } from '../types';

export const defaultGameConfig: GameConfig = {
  player: {
    name: "Flash",
    assetUrl: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-class-images.s3.us-east-1.amazonaws.com%252FSandro%252F20250313_201207.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg",
    color: "#1E40AF",
  },
  cpu: {
    name: "Loki",
    assetUrl: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_174142_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg",
    color: "#991B1B",
    dialogues: {
      defeat: [
        "Well well, Flash... Impressive. But my next defensive scheme will make your head spin faster than your super speed!",
        "Think you've mastered my defense? Time to introduce you to my elite squad. They're not just fast—they're quantum fast!",
        "Congratulations on the fluke, speedster! My next defensive line eats lightning for breakfast. Let's see you dance through that!",
        "Not bad, Flash, not bad at all. My next defense has been studying your every move. Good luck breaking through THIS coverage!",
        "The famous Flash, breaking through my defense. My next squad is powered by chaos magic. Try outrunning THAT!",
        "You may be quick, Flash, but my next defense is INEVITABLE. They've got schemes you haven't seen in any timeline!",
        "You're GOOD, Flash. But my next defensive formation is designed by the God of Mischief himself. Ready for divine intervention?",
        "Look who's got moves! My next defense? They're variants from timelines where YOU lost. Chew on that, speedster!"
      ],
      victory: [
        "Not so fast now, are you, Flash? My defense just rewrote the laws of physics—and your defeat!",
        "This is DELICIOUS! The fastest man alive, stopped dead in his tracks by MY defensive masterpiece!",
        "That's how you contain a speedster! Maybe try the minor leagues next time, Flash!",
        "Your speed means NOTHING against my strategic genius! Better luck in the next timeline, Flash!",
        "Game over, Flash! My defense just showed you why they call me the God of Mischief!",
        "Too slow, too predictable, too DEFEATED! This is what happens when you challenge a god, Flash!"
      ],
      playerHit: [
        "Impressive read, Flash! But don't get cocky—my defense adapts faster than you run!",
        "Found a gap in my coverage? Enjoy it while it lasts, speedster!",
        "Nice play, Flash! But my defense? They're just warming up!",
        "Clever move through my defense! But can you keep up when I REALLY start playing?",
        "Not bad for a mortal! But my next defensive shift will give you whiplash!",
        "You're quick, Flash, I'll give you that. But my defense is learning your patterns!",
        "You broke through! Let's see you do that again when I unleash chaos!",
        "Well played, speedster! But my defense has more tricks than your rogues gallery!"
      ],
      playerMiss: [
        "Too slow, Flash! My defense moves at the speed of mischief!",
        "Even the fastest man alive can't break through THIS coverage!",
        "Missed by a timeline, Flash! My defense is beyond your mortal calculations!",
        "Not finding any gaps? Welcome to MY game, speedster!",
        "Did my defense just make the Flash look... slow?",
        "Your speed is impressive, but my defense is supernatural!",
        "Running out of ideas, Flash? My defense tends to have that effect!",
        "Nice try, but my defense doesn't play by your earthly rules!"
      ]
    }
  },
  sidekick: {
    name: "Offensive Coordinator",
    assetUrl: "https://images.unsplash.com/photo-1631495634750-0c507757656b?q=80&w=2048&auto=format&fit=crop",
    color: "#047857",
    dialogues: {
      hit: [
        "Great execution on that play!",
        "Keep the pressure on their defense!"
      ],
      defeat: [
        "We'll adjust our game plan!",
        "Time to switch up our strategy!"
      ],
      victory: [
        "Offensive masterclass!",
        "That's how we break down a defense!"
      ],
      correctAnswer: [
        "Perfect read, Coach Flash!",
        "You're seeing the field clearly!",
        "Great offensive execution, Flash!",
        "That's how we draw it up!",
        "Perfect timing on that play!",
        "Their defense can't stop us!",
        "You're calling the perfect plays, Flash!",
        "The offense is clicking!",
        "Keep that momentum going, Flash!",
        "Beautiful play design!",
        "You're in the zone, Coach Flash!",
        "They can't handle our offense!"
      ],
      incorrectAnswer: [
        "Let's reset and try another play, Flash!",
        "Even Tom Brady throws incompletions!",
        "We'll find the open receiver, Coach!",
        "Their coverage was tight on that one, Flash!",
        "Let's check the defense and adjust!",
        "Take your time reading the defense, Flash!",
        "We've got more plays in the playbook!",
        "Keep your eyes downfield, Coach!",
        "Stay focused, Flash!",
        "We'll break through their coverage!",
        "That's alright, next play Flash!",
        "Let's try a different route combination!"
      ]
    }
  },
  backgroundUrl: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_182540_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg",
  levels: [
    {
      id: 1,
      name: "Junior Varsity",
      description: "Basic defensive formations 1-5",
      maxNumber: 25,
      minShips: { player: 5, cpu: 4 },
      boardSize: { rows: 5, cols: 5 },
      cpuImage: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_174142_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg"
    },
    {
      id: 2,
      name: "Varsity",
      description: "Advanced formations with numbers 1-7",
      maxNumber: 49,
      minShips: { player: 5, cpu: 4 },
      boardSize: { rows: 5, cols: 10 },
      cpuImage: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_175053_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg"
    },
    {
      id: 3,
      name: "Pro League",
      description: "Professional defensive schemes 1-10",
      maxNumber: 100,
      minShips: { player: 5, cpu: 4 },
      boardSize: { rows: 10, cols: 10 },
      cpuImage: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_175544_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg"
    }
  ],
  music: [
    {
      id: "space-adventure",
      name: "Game Day",
      url: "/src/components/music1.mp3",
      icon: "🏈"
    },
    {
      id: "battle-theme",
      name: "Victory March",
      url: "/src/components/music2.mp3",
      icon: "🏆"
    },
    {
      id: "cosmic-journey",
      name: "Championship",
      url: "/src/components/music3.mp3",
      icon: "🎯"
    }
  ]
};