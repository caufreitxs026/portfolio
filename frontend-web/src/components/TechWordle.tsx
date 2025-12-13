'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Terminal, ShieldAlert, HelpCircle, Delete, Check } from 'lucide-react';

const NORMAL_WORDS = ['PYTHON', 'DOCKER', 'CODING', 'DEPLOY', 'SERVER', 'NEXTJS', 'UBUNTU', 'GOLANG', 'REACTS', 'NODEJS'];
const SECRET_WORDS = ['MATRIX', 'ACCESS', 'SECURE', 'HACKER', 'BYPASS', 'HIDDEN', 'SYSTEM', 'TROJAN', 'BINARY', 'ROOTED'];

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 6;

export default function TechWordle({ onClose }: { onClose: () => void }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      const secretActive = document.body.classList.contains('secret-active');
      setIsSecretMode(secretActive);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const gameWords = useMemo(() => isSecretMode ? SECRET_WORDS : NORMAL_WORDS, [isSecretMode]);

  useEffect(() => {
    if (gameWords.length > 0) startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameWords]);

  const startNewGame = () => {
    const randomWord = gameWords[Math.floor(Math.random() * gameWords.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
  };

  const handleKeyDown = (key: string) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) return;
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === targetWord) {
        setGameState('won');
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameState('lost');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKeyDown(key);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [currentGuess, gameState]);

  // Função auxiliar para verificar status da letra no teclado
  const getKeyStatus = (key: string) => {
    let status = 'neutral';
    // Verifica todas as tentativas passadas
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (targetWord[i] === key) return 'correct'; // Prioridade máxima (Verde)
          if (targetWord.includes(key) && status !== 'correct') status = 'present'; // Amarelo
          if (!targetWord.includes(key) && status === 'neutral') status = 'absent'; // Cinza
        }
      }
    }
    return status;
  };

  const renderRow = (guess: string | undefined, isCurrent: boolean) => {
    const letters = (guess || '').padEnd(WORD_LENGTH, ' ').split('');
    return (
      <div className="flex gap-1.5 justify-center mb-2">
        {letters.map((char, i) => {
          let status = 'neutral';
          if (!isCurrent && guess) {
            if (char === targetWord[i]) status = 'correct';
            else if (targetWord.includes(char)) status = 'present';
            else status = 'absent';
          }

          let styleClass = '';
          // Lógica de cores baseada no modo (Normal vs Secreto)
          if (status === 'correct') {
            styleClass = isSecretMode 
              ? 'bg-pink-600 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]' 
              : 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]';
          } else if (status === 'present') {
            styleClass = 'bg-yellow-600 border-yellow-500 text-white shadow-[0_0_10px_rgba(202,138,4,0.4)]';
          } else if (status === 'absent') {
            styleClass = 'bg-slate-800/80 border-slate-700 text-slate-500';
          } else if (isCurrent && char !== ' ') {
            styleClass = isSecretMode 
              ? 'border-pink-500 text-pink-200 bg-pink-500/10 shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
              : 'border-emerald-500 text-emerald-200 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
          } else {
            styleClass = 'border-slate-700/50 text-slate-600 bg-slate-900/30';
          }

          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                w-10 h-12 sm:w-12 sm:h-14 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg font-mono
                ${styleClass}
              `}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (!mounted) return null;

  return createPortal(
    <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 w-screen h-screen"
    >
      <div className={`
        relative rounded-2xl shadow-2xl w-full max-w-lg border flex flex-col overflow-hidden
        ${isSecretMode ? 'bg-black/90 border-pink-500/50 shadow-pink-500/20' : 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-500/20'}
        max-h-[90vh] backdrop-blur-xl ring-1 ring-white/10
      `}>
        {/* Header */}
        <div className={`flex-shrink-0 p-4 border-b flex justify-between items-center ${isSecretMode ? 'border-pink-500/20 bg-pink-950/30' : 'border-emerald-500/20 bg-emerald-950/30'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSecretMode ? 'bg-pink-500/20 text-pink-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {isSecretMode ? <ShieldAlert size={24} /> : <Terminal size={24} />}
                </div>
                <div>
                    <h2 className={`text-xl font-bold font-mono tracking-wide ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'}`}>
                        {isSecretMode ? 'SYSTEM HACK' : 'CODE BREAKER'}
                    </h2>
                </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHelp(!showHelp)} className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition"><HelpCircle size={22} /></button>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition"><X size={22} /></button>
            </div>
        </div>

        {/* Tutorial */}
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-950/80 px-6 py-4 text-sm text-slate-300 border-b border-white/5"
            >
              <p className="font-bold mb-3 text-white text-xs uppercase tracking-wider">Protocolo:</p>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex items-center gap-3"><span className={`w-4 h-4 rounded shadow ${isSecretMode ? 'bg-pink-600' : 'bg-emerald-600'}`}></span> <span className="text-white font-bold">CORRETO</span></li>
                <li className="flex items-center gap-3"><span className="w-4 h-4 rounded bg-yellow-600 shadow"></span> <span className="text-white">POSIÇÃO ERRADA</span></li>
                <li className="flex items-center gap-3"><span className="w-4 h-4 rounded bg-slate-700 shadow"></span> <span className="text-slate-500">INCORRETO</span></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar flex flex-col items-center justify-start bg-gradient-to-b from-transparent to-black/40">
          <div className="w-full max-w-sm space-y-1">
            {guesses.map((g, i) => renderRow(g, false))}
            {gameState === 'playing' && renderRow(currentGuess, true)}
            {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length))].map((_, i) => renderRow('', false))}
          </div>
        </div>

        {/* Footer & Keyboard */}
        <div className={`flex-shrink-0 p-4 border-t backdrop-blur-md ${isSecretMode ? 'bg-pink-950/20 border-pink-500/20' : 'bg-emerald-950/20 border-emerald-500/20'}`}>
            {gameState !== 'playing' && (
              <div className={`text-center animate-fade-in mb-4 p-3 rounded-lg border ${isSecretMode ? 'bg-pink-500/10 border-pink-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <p className={`font-bold text-lg mb-2 ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'} font-mono`}>
                  {gameState === 'won' ? (isSecretMode ? 'SYSTEM UNLOCKED! 🔓' : 'ACCESS GRANTED! 🔓') : `SENHA: ${targetWord}`}
                </p>
                <button onClick={startNewGame} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold shadow-lg transition w-full hover:scale-[1.02] active:scale-[0.98] ${isSecretMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                  <RotateCcw size={18} /> REINICIAR
                </button>
              </div>
            )}

            <div className="grid grid-cols-10 gap-1.5 select-none">
              {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                <div key={i} className="col-span-10 flex justify-center gap-1.5">
                  {row.split('').map(char => {
                    const status = getKeyStatus(char);
                    let keyColor = isSecretMode 
                        ? 'bg-slate-800 text-slate-300 hover:bg-pink-900/40 border-pink-500/0 hover:border-pink-500/50' 
                        : 'bg-slate-800 text-slate-300 hover:bg-emerald-900/40 border-emerald-500/0 hover:border-emerald-500/50';
                    
                    if (status === 'correct') keyColor = isSecretMode ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-500/20' : 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20';
                    if (status === 'present') keyColor = 'bg-yellow-600 text-white border-yellow-500';
                    if (status === 'absent') keyColor = 'bg-slate-900 text-slate-600 border-slate-950 opacity-60';

                    return (
                      <button 
                        key={char} 
                        onClick={() => handleKeyDown(char)} 
                        className={`
                          h-10 sm:h-12 flex-1 min-w-[24px] text-xs sm:text-sm rounded-md font-bold transition-all active:scale-95 border-b-4 border-black/40 shadow-sm
                          ${keyColor}
                        `}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="col-span-10 flex justify-center gap-2 mt-2">
                <button onClick={() => handleKeyDown('BACKSPACE')} className="h-10 px-4 bg-slate-700 text-white rounded-md text-xs font-bold hover:bg-red-600/80 transition-colors flex-1 max-w-[100px] border-b-4 border-black/40 active:border-b-0 active:translate-y-1 flex items-center justify-center"><Delete size={18} /></button>
                <button onClick={() => handleKeyDown('ENTER')} className={`h-10 px-4 text-white rounded-md text-xs font-bold transition-colors flex-1 max-w-[100px] border-b-4 border-black/40 active:border-b-0 active:translate-y-1 flex items-center justify-center ${isSecretMode ? 'bg-pink-700 hover:bg-pink-600' : 'bg-emerald-700 hover:bg-emerald-600'}`}><Check size={18} /></button>
              </div>
            </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
