import { Howl } from 'howler';

// Sound effects using Howler.js
const sounds = {
  buttonClick: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
    volume: 0.2,
    preload: true,
    html5: true
  }),
  victory: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'],
    volume: 0.6,
    preload: true,
    html5: true
  }),
  defeat: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'],
    volume: 0.6,
    preload: true,
    html5: true
  }),
  hit: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3'],
    volume: 0.5,
    preload: true,
    html5: true
  }),
  multiHit: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.7,
    preload: true,
    html5: true
  }),
  explosion: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3'],
    volume: 0.6,
    preload: true,
    html5: true
  })
};

// Audio state management
let currentMusic: Howl | null = null;
let currentVoice: Howl | null = null;
let isVoicePlaying = false;

// Initialize audio context
export const initAudioContext = () => {
  Howler.autoUnlock = true;
  Howler.autoSuspend = false;
  return true;
};

export const playSound = (soundName: keyof typeof sounds) => {
  try {
    if (sounds[soundName]) {
      const sound = sounds[soundName];
      if (!sound.playing()) {
        sound.play();
      }
    }
  } catch (error) {
    console.error(`Error playing sound ${soundName}:`, error);
  }
};

export const stopSound = (soundName: keyof typeof sounds) => {
  try {
    if (sounds[soundName]) {
      sounds[soundName].stop();
    }
  } catch (error) {
    console.error(`Error stopping sound ${soundName}:`, error);
  }
};

export const playBackgroundMusic = (url: string, volume: number = 0.3) => {
  try {
    if (currentMusic) {
      currentMusic.stop();
      currentMusic.unload();
    }

    currentMusic = new Howl({
      src: [url],
      loop: true,
      volume: volume,
      html5: true,
      preload: true
    });
    
    currentMusic.play();
  } catch (error) {
    console.error('Failed to play background music:', error);
  }
};

export const stopBackgroundMusic = () => {
  if (currentMusic) {
    currentMusic.stop();
    currentMusic.unload();
    currentMusic = null;
  }
};

export const setMusicVolume = (volume: number) => {
  if (currentMusic) {
    currentMusic.volume(volume);
  }
};

// Eleven Labs voice synthesis
const KRAVEN_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX';

export const stopCurrentVoice = () => {
  if (currentVoice) {
    currentVoice.stop();
    currentVoice.unload();
    currentVoice = null;
  }
  isVoicePlaying = false;
};

export const playKravenVoice = async (text: string): Promise<void> => {
  try {
    if (isVoicePlaying) {
      console.log('Voice already playing, stopping current voice');
      stopCurrentVoice();
      // Add a small delay before starting new voice
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
    
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('Eleven Labs API key not found');
    }

    isVoicePlaying = true;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${KRAVEN_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.8,
          speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    currentVoice = new Howl({
      src: [url],
      format: ['mp3'],
      html5: true,
      preload: true,
      onend: () => {
        URL.revokeObjectURL(url);
        stopCurrentVoice();
      },
      onloaderror: () => {
        URL.revokeObjectURL(url);
        stopCurrentVoice();
      },
      onstop: () => {
        URL.revokeObjectURL(url);
        stopCurrentVoice();
      }
    });

    currentVoice.play();
  } catch (error) {
    console.error('Error in voice synthesis:', error);
    isVoicePlaying = false;
    throw error;
  }
};