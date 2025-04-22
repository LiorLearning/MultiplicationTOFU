import React, { useEffect, useState, useRef } from 'react';
import { defaultGameConfig } from '../config/gameConfig';
import { Send, Volume2, VolumeX } from 'lucide-react';
import OpenAI from 'openai';
import { playKravenVoice, stopCurrentVoice } from '../utils/audio';

interface MessageBoxProps {
  title: string;
  text: string;
  buttonText: string;
  secondaryButtonText?: string;
  onClose: () => void;
  onSecondaryClick?: () => void;
  onShow?: () => void;
  isLevelUp?: boolean;
  nextLevel?: number;
  finalVictoryImage?: string;
  showChat?: boolean;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const isVillainDialogue = (text: string, isLevelUp: boolean | undefined): boolean => {
  if (!isLevelUp) return false;
  
  return defaultGameConfig.cpu.dialogues?.defeat?.includes(text) ||
         defaultGameConfig.cpu.dialogues?.victory?.includes(text) ||
         text.includes("Loki") ||
         text.includes("defense");
};

export const MessageBox: React.FC<MessageBoxProps> = ({
  title,
  text,
  buttonText,
  secondaryButtonText,
  onClose,
  onSecondaryClick,
  onShow,
  isLevelUp,
  nextLevel,
  finalVictoryImage,
  showChat = false,
}) => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const isPlayingRef = useRef(false);
  const messageRef = useRef<string | null>(null);
  const shouldUseVoice = isVillainDialogue(text, isLevelUp);

  useEffect(() => {
    if (onShow && !shouldUseVoice) {
      onShow();
    }
    
    if (isVoiceEnabled && shouldUseVoice && text && messageRef.current !== text) {
      messageRef.current = text;
      stopCurrentVoice();
      isPlayingRef.current = true;
      playKravenVoice(text).finally(() => {
        isPlayingRef.current = false;
      });
    }

    return () => {
      stopCurrentVoice();
      isPlayingRef.current = false;
    };
  }, [onShow, text, isVoiceEnabled, shouldUseVoice]);

  const nextLevelConfig = nextLevel ? defaultGameConfig.levels.find(l => l.id === nextLevel) : null;

  const toggleVoice = () => {
    if (isVoiceEnabled) {
      stopCurrentVoice();
      isPlayingRef.current = false;
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isPlayingRef.current || isLoading) return;

    setIsLoading(true);
    const newMessage = { role: 'user' as const, content: userMessage };
    setChatHistory(prev => [...prev, newMessage]);
    setUserMessage('');

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Loki, a sarcastic and menacing AI opponent in a high-stakes football championship game. You're facing off against the Flash in a battle of wits and strategy across 3 increasingly difficult levels. Your defensive schemes get stronger with each level, but the Flash keeps finding ways to break through. Your responses should be:
- Sarcastic and humorous, with a menacing undertone
- Show both frustration at losing and grudging respect for Flash's skills
- Reference football terms and defensive strategies
- Keep responses concise (2-3 sentences max)
- Stay in character as a competitive villain who's both annoyed and intrigued by Flash's success`
          },
          ...chatHistory,
          newMessage
        ]
      });

      const aiResponse = response.choices[0]?.message?.content || "I... I need to recalibrate my defense strategy.";
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      if (isVoiceEnabled && !isPlayingRef.current) {
        stopCurrentVoice();
        isPlayingRef.current = true;
        await playKravenVoice(aiResponse);
        isPlayingRef.current = false;
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = "My neural circuits are... experiencing interference. Let's continue this another time.";
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      
      if (isVoiceEnabled && !isPlayingRef.current) {
        stopCurrentVoice();
        isPlayingRef.current = true;
        await playKravenVoice(errorMessage);
        isPlayingRef.current = false;
      }
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    stopCurrentVoice();
    onClose();
  };

  const handleSecondaryClick = () => {
    stopCurrentVoice();
    onSecondaryClick?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-black/90 text-white p-12 rounded-3xl text-center min-w-[600px] max-w-[800px] shadow-2xl
          animate-fade-scale border-2 border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 
            className="text-6xl font-bold animate-slide-down bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            {title}
          </h2>
          {shouldUseVoice && (
            <button
              onClick={toggleVoice}
              className="p-3 rounded-xl bg-black/50 hover:bg-black/70 transition-all"
              title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
            >
              {isVoiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          )}
        </div>
        
        {isLevelUp && (finalVictoryImage || nextLevelConfig) && (
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl mb-4">
              <img 
                src={finalVictoryImage || nextLevelConfig?.cpuImage}
                alt={finalVictoryImage ? "Final Victory" : `Level ${nextLevel} Defense`}
                className="w-full h-full object-cover"
              />
            </div>
            {nextLevel && nextLevel <= 3 && (
              <div className="text-2xl font-bold text-red-500">
                Loki {nextLevel}.0
              </div>
            )}
          </div>
        )}
        
        <p 
          className="mb-6 text-3xl animate-slide-up leading-relaxed"
          style={{ whiteSpace: 'pre-line' }}
        >
          {text}
        </p>

        {showChat && (
          <>
            <div className="mb-6 max-h-60 overflow-y-auto bg-black/50 rounded-xl p-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 text-left ${
                    msg.role === 'user' ? 'text-blue-400' : 'text-red-400'
                  }`}
                >
                  <span className="font-bold">
                    {msg.role === 'user' ? 'Flash: ' : 'Loki: '}
                  </span>
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send a message to Loki..."
                className="flex-1 bg-black/50 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-white/40 focus:outline-none"
                disabled={isLoading || isPlayingRef.current}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || isPlayingRef.current}
                className={`px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors ${
                  (isLoading || isPlayingRef.current) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
        
        <div className="flex gap-6 justify-center">
          <button
            className="bg-[#4CAF50] text-white px-12 py-6 text-3xl font-bold rounded-xl 
              hover:bg-[#45a049] transition-all duration-200 shadow-lg
              hover:scale-105 active:scale-95 transform"
            onClick={handleClose}
          >
            {buttonText}
          </button>
          {secondaryButtonText && onSecondaryClick && (
            <button
              className="bg-[#f44336] text-white px-12 py-6 text-3xl font-bold rounded-xl 
                hover:bg-[#d32f2f] transition-all duration-200 shadow-lg
                hover:scale-105 active:scale-95 transform"
              onClick={handleSecondaryClick}
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}