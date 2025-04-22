import React, { useState, useEffect } from 'react';
import { MusicTrack } from '../types';
import { playBackgroundMusic, stopBackgroundMusic, initAudioContext } from '../utils/audio';
import { Play, Pause, Music2, Music3, Music4 } from 'lucide-react';

interface MusicControlsProps {
  tracks: MusicTrack[];
}

export const MusicControls: React.FC<MusicControlsProps> = ({ tracks }) => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Initialize audio context on component mount
    initAudioContext();
  }, []);

  const handleTrackSelect = (trackId: string) => {
    try {
      if (!audioInitialized) {
        initAudioContext();
        setAudioInitialized(true);
      }

      const track = tracks.find(t => t.id === trackId);
      if (track) {
        setCurrentTrackId(trackId);
        playBackgroundMusic(track.url);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error selecting track:', error);
    }
  };

  const togglePlayStop = () => {
    try {
      if (!audioInitialized) {
        initAudioContext();
        setAudioInitialized(true);
      }

      if (isPlaying) {
        stopBackgroundMusic();
        setIsPlaying(false);
      } else if (currentTrackId) {
        const track = tracks.find(t => t.id === currentTrackId);
        if (track) {
          playBackgroundMusic(track.url);
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error toggling play/stop:', error);
    }
  };

  const musicIcons = [
    <Music2 size={32} key="music-icon-1" />,
    <Music3 size={32} key="music-icon-2" />,
    <Music4 size={32} key="music-icon-3" />
  ];

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 backdrop-blur-sm p-4 rounded-2xl z-10 text-white flex flex-col gap-4 shadow-xl border border-white/10">
      {tracks.map((track, index) => (
        <button
          key={track.id}
          onClick={() => handleTrackSelect(track.id)}
          className={`p-4 rounded-xl transition-all ${
            currentTrackId === track.id 
              ? 'bg-white/30 text-white shadow-inner' 
              : 'bg-black/50 text-gray-300 hover:bg-black/70'
          } hover:scale-105 active:scale-95 transform`}
        >
          {musicIcons[index]}
        </button>
      ))}

      <button
        onClick={togglePlayStop}
        className="p-4 rounded-xl bg-black/50 text-gray-300 hover:bg-black/70 transition-all hover:scale-105 active:scale-95 transform mt-2"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>
    </div>
  );
};