import { useState, useEffect, useCallback } from 'react';
import { MusicTrack } from '../types';
import { playBackgroundMusic, stopBackgroundMusic, initAudioContext } from '../utils/audio';

export const useAudioControls = (tracks: MusicTrack[]) => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    initAudioContext();
  }, []);

  const handleTrackSelect = useCallback((trackId: string, musicFile: string) => {
    try {
      if (!audioInitialized) {
        initAudioContext();
        setAudioInitialized(true);
      }

      const track = tracks.find(t => t.id === trackId);
      if (track) {
        setCurrentTrackId(trackId);
        playBackgroundMusic(musicFile);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error selecting track:', error);
    }
  }, [tracks, audioInitialized]);

  const togglePlayStop = useCallback((musicFile: string | null) => {
    try {
      if (!audioInitialized) {
        initAudioContext();
        setAudioInitialized(true);
      }

      if (isPlaying) {
        stopBackgroundMusic();
        setIsPlaying(false);
      } else if (currentTrackId && musicFile) {
        playBackgroundMusic(musicFile);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/stop:', error);
    }
  }, [isPlaying, currentTrackId, audioInitialized]);

  return {
    currentTrackId,
    isPlaying,
    handleTrackSelect,
    togglePlayStop,
  };
};