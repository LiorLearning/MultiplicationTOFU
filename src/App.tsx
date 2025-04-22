import { useCallback, useEffect, useState, useRef } from 'react';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { MessageBox } from './components/MessageBox';
import { MusicControls } from './components/MusicControls';
import { useGameStore } from './store/gameStore';
import { useMessageState } from './hooks/useMessageState';
import { playSound } from './utils/audio';
import { defaultGameConfig } from './config/gameConfig';
import { saveFormSubmission } from './lib/supabase';

function App() {
  const gameState = useGameStore();
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showNameInput, setShowNameInput] = useState(true);
  const [showCreateGameForm, setShowCreateGameForm] = useState(true);
  const [showMissPopup, setShowMissPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [lastTarget, setLastTarget] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameFormData, setGameFormData] = useState({
    hero: '',
    villain: '',
    gameplay: '',
    setting: '',
    mathTopic: '',
    contactInfo: ''
  });
  const boardRef = useRef<HTMLDivElement>(null);
  
  const {
    setGameState,
    checkGameEnd,
    initializeBoard,
    cpuTurn,
    findMultiplicationCoordinates,
  } = useGameStore(state => ({
    setGameState: state.setGameState,
    checkGameEnd: state.checkGameEnd,
    initializeBoard: state.initializeBoard,
    cpuTurn: state.cpuTurn,
    findMultiplicationCoordinates: state.findMultiplicationCoordinates,
  }));

  const {
    message,
    showVictoryMessage,
    showGameOverMessage,
    showHitMessage,
    showMissMessage,
    setMessage,
  } = useMessageState(initializeBoard);

  // Initialize board on first load
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Skip introduction if player name is already set
  useEffect(() => {
    if (playerName) {
      setShowIntroduction(false);
    }
  }, [playerName]);

  // Modified victory message to include create game option
  const handleVictory = useCallback(async (score: number, level: number) => {
    const nextLevel = level + 1;
    const isGameComplete = nextLevel > defaultGameConfig.levels.length;
    
    if (isGameComplete) {
      const finalDialogue = defaultGameConfig.cpu.dialogues?.defeat?.[
        Math.floor(Math.random() * (defaultGameConfig.cpu.dialogues?.defeat?.length || 1))
      ] || '';
      
      setMessage({
        title: 'Championship Victory!',
        text: finalDialogue,
        buttonText: 'Play Again',
        secondaryButtonText: 'Create Your Own Game',
        onSecondaryClick: () => {
          setMessage(null);
          playSound('buttonClick');
          setShowCreateGameForm(true);
        },
        isLevelUp: true,
        finalVictoryImage: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fmk-uploaded-images.s3.us-east-1.amazonaws.com%252Fimages%252F20250313_181342_image.png&w=3840&q=75&dpl=dpl_6pcz7p6GGU3SA8rDQev6qyQbiyDg",
        showChat: true,
        onClose: () => {
          setMessage(null);
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
        secondaryButtonText: 'Create Your Own Game',
        onSecondaryClick: () => {
          setMessage(null);
          playSound('buttonClick');
          setShowCreateGameForm(true);
        },
        isLevelUp: true,
        nextLevel: nextLevel,
        showChat: true,
        onClose: () => {
          setMessage(null);
          playSound('buttonClick');
          initializeBoard(nextLevel);
        }
      });
    }
  }, [initializeBoard, setMessage]);

  // Check if game is over (player lost)
  const checkPlayerLost = useCallback(() => {
    const remainingPlayerShips = gameState.board.reduce((count, row, rowIndex) => 
      count + row.reduce((rowCount, cell, colIndex) => 
        rowCount + (gameState.playerShips.some(ship => 
          ship.row === rowIndex && 
          ship.col === colIndex && 
          !cell.isHit
        ) ? 1 : 0), 
      0), 
    0);
    
    const remainingComputerShips = gameState.board.reduce((count, row, rowIndex) => 
      count + row.reduce((rowCount, cell, colIndex) => 
        rowCount + (gameState.computerShips.some(ship => 
          ship.row === rowIndex && 
          ship.col === colIndex && 
          !cell.isHit
        ) ? 1 : 0), 
      0), 
    0);
    
    return remainingPlayerShips === 0 && remainingComputerShips > 0;
  }, [gameState.board, gameState.playerShips, gameState.computerShips]);
  
  // Handler for retry button in game over popup
  const handleRetry = useCallback(() => {
    setShowGameOverPopup(false);
    playSound('buttonClick');
    initializeBoard(gameState.level);
  }, [gameState.level, initializeBoard]);
  
  // Handler for restart button in game over popup
  const handleRestart = useCallback(() => {
    setShowGameOverPopup(false);
    playSound('buttonClick');
    initializeBoard(1);
  }, [initializeBoard]);

  // Handler for closing miss popup
  const handleCloseMissPopup = useCallback(async () => {
    setShowMissPopup(false);
    
    // Run CPU turn after miss popup is closed
    const result = await cpuTurn();
    if (result) {
      const updatedGameEndState = checkGameEnd(result.newAttempts);
      if (updatedGameEndState.isGameOver && !updatedGameEndState.playerWon) {
        if (checkPlayerLost()) {
          playSound('defeat');
          setShowGameOverPopup(true);
        } else {
          showGameOverMessage(gameState.score);
        }
      }
    }
  }, [cpuTurn, checkGameEnd, showGameOverMessage, gameState.score, checkPlayerLost]);

  const handleFire = useCallback(async () => {
    if (gameState.userAnswer === '') {
      playSound('buttonClick');
      return;
    }

    const targetNumber = parseInt(gameState.userAnswer);
    if (isNaN(targetNumber)) {
      playSound('buttonClick');
      return;
    }

    const coordinates = findMultiplicationCoordinates(targetNumber);
    if (coordinates.length === 0) {
      playSound('buttonClick');
      return;
    }

    setLastTarget(targetNumber.toString());

    let hits = 0;
    const newAttempts = [...gameState.attempts];
    const newBoard = [...gameState.board];
    
    coordinates.forEach(coord => {
      if (!newAttempts.some(a => a.row === coord.row && a.col === coord.col && !a.isPlayerShip)) {
        newAttempts.push({ ...coord, isPlayerShip: false });
        if (newBoard[coord.row]?.[coord.col]?.hasComputerShip) {
          hits++;
          newBoard[coord.row][coord.col].isHit = true;
        }
      }
    });

    const pointsMultiplier = hits > 1 ? 2 : 1;
    const levelMultiplier = gameState.level;
    const newScore = gameState.score + (hits * 100 * pointsMultiplier * levelMultiplier);

    setGameState({
      board: newBoard,
      attempts: newAttempts,
      score: newScore,
      userAnswer: '',
      targetValue: null,
      turnCount: gameState.turnCount + 1,
    });

    const gameEndState = checkGameEnd(newAttempts);

    if (gameEndState.playerWon) {
      await handleVictory(newScore, gameState.level);
      return;
    }

    if (hits > 0) {
      if (hits > 1) {
        playSound('multiHit');
        setTimeout(() => playSound('explosion'), 300);
      } else {
        playSound('hit');
        setTimeout(() => playSound('explosion'), 200);
      }
    } else {
      // No hits, show miss popup
      playSound('buttonClick');
      setShowMissPopup(true);
      return; // Stop here until user dismisses popup
    }
    
    // CPU turn logic - only run after hit or if miss popup closed
    const result = await cpuTurn();
    if (result) {
      const updatedGameEndState = checkGameEnd(result.newAttempts);
      if (updatedGameEndState.isGameOver && !updatedGameEndState.playerWon) {
        if (checkPlayerLost()) {
          playSound('defeat');
          setShowGameOverPopup(true);
        } else {
          showGameOverMessage(gameState.score);
        }
      }
    }
  }, [gameState, cpuTurn, checkGameEnd, findMultiplicationCoordinates, setGameState, handleVictory, showGameOverMessage, checkPlayerLost]);

  const handleNumpadInput = useCallback((value: string) => {
    playSound('buttonClick');
    setGameState({
      userAnswer: gameState.userAnswer.length < 3 ? gameState.userAnswer + value : gameState.userAnswer
    });
  }, [gameState.userAnswer, setGameState]);

  const handleClear = useCallback(() => {
    playSound('buttonClick');
    setGameState({ userAnswer: '' });
  }, [setGameState]);

  const handleLevelSelect = useCallback((level: number) => {
    if (level > gameState.level) {
      playSound('victory');
    } else {
      playSound('buttonClick');
    }
    initializeBoard(level);
  }, [gameState.level, initializeBoard]);

  const handleSubmitGameIdea = useCallback(() => {
    // Save form data to Supabase
    saveFormSubmission(gameFormData)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error saving form submission:', error);
          // You could show an error message here
        } else {
          console.log('Game idea submitted successfully:', data);
          
          // Reset form data
          setGameFormData({
            hero: '',
            villain: '',
            gameplay: '',
            setting: '',
            mathTopic: '',
            contactInfo: ''
          });
          
          // Close the form
          setShowCreateGameForm(false);
          
          // Show thank you message with popup
          setMessage({
            title: 'Thanks for Your Game Idea!',
            text: "We've saved your idea and we'll turn it into an actual game. We'll contact you to collaborate on building it!",
            buttonText: 'Continue Playing',
            isLevelUp: true, // This ensures the message will be shown
            onClose: () => {
              setMessage(null);
              playSound('buttonClick');
            }
          });
        }
      });
  }, [gameFormData, setMessage]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) {
        handleNumpadInput(e.key);
      } else if (e.key === 'Enter') {
        handleFire();
      } else if (e.key === 'Escape' || e.key === 'Delete' || e.key === 'Backspace') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumpadInput, handleFire, handleClear]);

  return (
    <div 
      className="min-h-screen h-screen flex items-stretch font-['Orbitron',sans-serif] bg-cover bg-center bg-no-repeat overflow-y-auto"
      style={{
        backgroundImage: `url("${defaultGameConfig.backgroundUrl}")`,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="flex flex-1">
        <div ref={boardRef} className="flex-1 flex items-center justify-center">
          <Board 
            gameState={gameState} 
            onCellSelect={() => {}} 
          />
        </div>
        <MusicControls tracks={defaultGameConfig.music} />
        <ControlPanel
          gameState={gameState}
          onNumpadInput={handleNumpadInput}
          onFire={handleFire}
          onClear={handleClear}
          onLevelSelect={handleLevelSelect}
          playerName={playerName}
        />
      </div>
      
      {/* Only show level up and game over messages */}
      {message && message.isLevelUp && (
        <MessageBox {...message} />
      )}
      
      {/* Name Input Dialog - Shown at the very beginning */}
      {showNameInput && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/90 text-white p-8 rounded-3xl text-center max-w-lg shadow-2xl animate-fade-scale border-2 border-white/10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Enter Your Name
            </h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                  <img src={defaultGameConfig.player.assetUrl} alt="Flash" className="w-full h-full object-cover" />
                </div>
                <div className="text-xl font-bold text-red-500">VS</div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500">
                  <img src={defaultGameConfig.cpu.assetUrl} alt="Loki" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-black/50 text-white border-2 border-blue-500 rounded-xl px-4 py-3 mb-4 text-center text-xl"
                maxLength={20}
              />
              
              <div className="text-white text-left p-4 bg-blue-900/30 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-2">Game Rules:</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li>You are Flash, facing off against Loki</li>
                  <li>Enter products of row × column to attack</li>
                  <li>Destroy all of Loki's defenses to win</li>
                  <li>Advance through 3 levels of difficulty</li>
                </ul>
              </div>
            </div>
            
            <button
              className="bg-[#4CAF50] text-white px-6 py-3 text-xl font-bold rounded-xl 
                hover:bg-[#45a049] transition-all duration-200"
              onClick={() => {
                if (playerName.trim()) {
                  playSound('buttonClick');
                  setShowNameInput(false);
                  setShowIntroduction(false);
                } else {
                  alert("Please enter your name to continue");
                }
              }}
              disabled={!playerName.trim()}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
      {/* Create Your Own Game Form */}
      {showCreateGameForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/90 text-white p-8 rounded-3xl max-w-2xl shadow-2xl animate-fade-scale border-2 border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-white text-center">
              Create Your Own Game
            </h2>
            
            <p className="text-gray-300 mb-6 text-center">
              Share your idea and we'll transform it into an actual game
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Hero:
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.hero}
                  onChange={(e) => setGameFormData({...gameFormData, hero: e.target.value})}
                  placeholder="Who should be the hero?"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Villain:
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.villain}
                  onChange={(e) => setGameFormData({...gameFormData, villain: e.target.value})}
                  placeholder="Who should be the villain?"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Gameplay:
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.gameplay}
                  onChange={(e) => setGameFormData({...gameFormData, gameplay: e.target.value})}
                  placeholder="What would the gameplay be like?"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Setting:
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.setting}
                  onChange={(e) => setGameFormData({...gameFormData, setting: e.target.value})}
                  placeholder="Where does the game take place?"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Math Topic:
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.mathTopic}
                  onChange={(e) => setGameFormData({...gameFormData, mathTopic: e.target.value})}
                  placeholder="What math topics should we include?"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Contact Information: <span className="text-gray-400">(so we can reach out to you)</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-black/50 text-white border border-gray-500 rounded-lg px-4 py-2 focus:border-gray-300 focus:outline-none transition-colors"
                  value={gameFormData.contactInfo}
                  onChange={(e) => setGameFormData({...gameFormData, contactInfo: e.target.value})}
                  placeholder="Email or phone number"
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                className="bg-gray-800 text-white px-6 py-3 text-lg font-bold rounded-lg 
                  hover:bg-gray-700 transition-all duration-200 border border-gray-600"
                onClick={handleSubmitGameIdea}
              >
                Submit Idea
              </button>
              
              <button
                className="bg-gray-900 text-white px-6 py-3 text-lg font-bold rounded-lg 
                  hover:bg-gray-800 transition-all duration-200 border border-gray-700"
                onClick={() => {
                  playSound('buttonClick');
                  setShowCreateGameForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Miss popup */}
      {showMissPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-black/90 text-white p-8 rounded-3xl text-center max-w-md shadow-2xl animate-fade-scale border-2 border-red-600/50">
            <h2 className="text-4xl font-bold mb-2 text-red-500">Miss!</h2>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4">
                <img 
                  src={defaultGameConfig.cpu.assetUrl} 
                  alt="Loki" 
                  className="w-full h-full object-cover rounded-full border-2 border-red-500 opacity-50"
                />
              </div>
              
              <p className="text-2xl mb-2">
                Loki's defenders evaded your attack!
              </p>
              <p className="text-lg text-red-300 italic">
                "{defaultGameConfig.cpu.dialogues?.playerMiss?.[Math.floor(Math.random() * (defaultGameConfig.cpu.dialogues?.playerMiss?.length || 1))]}"
              </p>
              <p className="mt-4 text-yellow-200">
                Your target: <span className="font-bold">{lastTarget}</span>
              </p>
            </div>
            
            <button
              className="bg-red-600 text-white px-6 py-3 text-xl font-bold rounded-xl 
                hover:bg-red-700 transition-all duration-200"
              onClick={() => {
                playSound('buttonClick');
                handleCloseMissPopup();
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Game Over popup */}
      {showGameOverPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-black/90 text-white p-8 rounded-3xl text-center max-w-md shadow-2xl animate-fade-scale border-2 border-red-800">
            <h2 className="text-4xl font-bold mb-4 text-red-500">Game Over!</h2>
            
            <div className="text-center mb-6">
              <div className="flex justify-center gap-8 mb-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-2 overflow-hidden opacity-40">
                    <img 
                      src={defaultGameConfig.player.assetUrl} 
                      alt="Flash" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-red-300 font-bold">
                    0 remaining
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-2 overflow-hidden">
                    <img 
                      src={defaultGameConfig.cpu.assetUrl} 
                      alt="Loki" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-green-300 font-bold">
                    {gameState.board.reduce((count, row, rowIndex) => 
                      count + row.reduce((rowCount, cell, colIndex) => 
                        rowCount + (gameState.computerShips.some(ship => 
                          ship.row === rowIndex && 
                          ship.col === colIndex && 
                          !cell.isHit
                        ) ? 1 : 0), 
                      0), 
                    0)} remaining
                  </div>
                </div>
              </div>
              
              <p className="text-2xl mb-2">
                Loki has defeated Flash!
              </p>
              <p className="text-lg text-red-300 italic mb-4">
                "{defaultGameConfig.cpu.dialogues?.victory?.[Math.floor(Math.random() * (defaultGameConfig.cpu.dialogues?.victory?.length || 1))]}"
              </p>
              <p className="text-yellow-200">
                Your final score: <span className="font-bold">{gameState.score}</span>
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                className="bg-blue-600 text-white px-6 py-3 text-xl font-bold rounded-xl 
                  hover:bg-blue-700 transition-all duration-200"
                onClick={handleRetry}
              >
                Retry Level {gameState.level}
              </button>
              
              <button
                className="bg-red-600 text-white px-6 py-3 text-xl font-bold rounded-xl 
                  hover:bg-red-700 transition-all duration-200"
                onClick={handleRestart}
              >
                Restart Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;