import { useState, useCallback } from 'react';
import { MessageState } from '../types';
import { defaultGameConfig } from '../config/gameConfig';
import { playSound, stopCurrentVoice } from '../utils/audio';

const finalVictoryDialogues = [
  "No… NO! This wasn't supposed to happen! Flash, HOW COULD THIS BE?! AAGH!",
  "What?! My perfect plan… my ultimate defense… DEFEATED by Flash?! THIS CAN'T BE HAPPENING!",
  "No! NOOO! This was my moment! Flash, you were supposed to LOSE!",
  "Impossible! I had everything planned… and yet, Flash STILL WON?! AAGH!",
  "NO! My defense was unstoppable! HOW did Flash—ARGH! I won't forget this!",
  "This can't be! I had the upper hand! Flash... I... I WON'T ACCEPT THIS!"
];

const finalDefeatImage = "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_181342_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg";

export const useMessageState = (initializeBoard: (level: number) => void) => {
  const [message, setMessage] = useState<MessageState | null>(null);
  const [hasShownFirstHitMessage, setHasShownFirstHitMessage] = useState(false);

  const clearMessage = useCallback(() => {
    stopCurrentVoice();
    setMessage(null);
  }, []);

  const showVictoryMessage = useCallback(async (score: number, level: number) => {
    clearMessage();

    const nextLevel = level + 1;
    const isGameComplete = nextLevel > defaultGameConfig.levels.length;
    
    if (isGameComplete) {
      const finalDialogue = finalVictoryDialogues[Math.floor(Math.random() * finalVictoryDialogues.length)];
      
      setMessage({
        title: 'Championship Victory!',
        text: finalDialogue,
        buttonText: 'Play Again',
        secondaryButtonText: 'End Game',
        onSecondaryClick: () => {
          clearMessage();
          playSound('buttonClick');
          initializeBoard(1);
        },
        isLevelUp: true,
        finalVictoryImage: finalDefeatImage,
        showChat: true,
        onClose: () => {
          clearMessage();
          playSound('buttonClick');
          initializeBoard(1);
        }
      });
    } else {
      const defeatDialogue = defaultGameConfig.cpu.dialogues?.defeat?.[
        Math.floor(Math.random() * (defaultGameConfig.cpu.dialogues?.defeat?.length || 1))
      ] || '';
      
      setMessage({
        title: 'Level Complete!',
        text: defeatDialogue,
        buttonText: 'Next Level',
        secondaryButtonText: 'End Game',
        onSecondaryClick: () => {
          clearMessage();
          playSound('buttonClick');
          initializeBoard(1);
        },
        isLevelUp: true,
        nextLevel: nextLevel,
        showChat: true,
        onClose: () => {
          clearMessage();
          playSound('buttonClick');
          initializeBoard(nextLevel);
        }
      });
    }
  }, [initializeBoard, clearMessage]);

  const showGameOverMessage = useCallback((score: number) => {
    clearMessage();

    const gameOverDialogue = defaultGameConfig.cpu.dialogues?.victory?.[
      Math.floor(Math.random() * (defaultGameConfig.cpu.dialogues?.victory?.length || 1))
    ] || '';

    setMessage({
      title: 'Game Over',
      text: gameOverDialogue,
      buttonText: 'Try Again',
      secondaryButtonText: 'End Game',
      showChat: true,
      onSecondaryClick: () => {
        clearMessage();
        playSound('buttonClick');
        initializeBoard(1);
      },
      onClose: () => {
        clearMessage();
        playSound('buttonClick');
      }
    });
  }, [initializeBoard, clearMessage]);

  const showHitMessage = useCallback((hits: number, onClose?: () => void) => {
    clearMessage();

    if (!hasShownFirstHitMessage) {
      setHasShownFirstHitMessage(true);
      setMessage({
        title: 'First Hit!',
        text: `Enemy vessel${hits > 1 ? 's' : ''} destroyed! Now you can taunt Loki!`,
        buttonText: 'Continue',
        showChat: true,
        onClose: () => {
          clearMessage();
          playSound('buttonClick');
          onClose?.();
        }
      });
    } else {
      setMessage({
        title: 'Direct Hit!',
        text: `Enemy vessel${hits > 1 ? 's' : ''} destroyed!`,
        buttonText: 'Continue',
        onClose: () => {
          clearMessage();
          playSound('buttonClick');
          onClose?.();
        }
      });
    }
  }, [clearMessage, hasShownFirstHitMessage]);

  const showMissMessage = useCallback((onClose?: () => void) => {
    clearMessage();

    setMessage({
      title: 'Miss',
      text: 'No enemy vessels detected.',
      buttonText: 'Continue',
      onClose: () => {
        clearMessage();
        playSound('buttonClick');
        onClose?.();
      }
    });
  }, [clearMessage]);

  return {
    message,
    setMessage,
    showVictoryMessage,
    showGameOverMessage,
    showHitMessage,
    showMissMessage,
  };
};