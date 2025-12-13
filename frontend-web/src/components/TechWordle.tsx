'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Terminal, ShieldAlert, HelpCircle, Delete } from 'lucide-react';

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
      if (currentGuess === targetWord) setGameState('won');
      else if (newGuesses.length >= MAX_ATTEMPTS) setGameState('lost');
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) handleKeyDown(key);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [currentGuess, gameState]);

  // Função auxiliar para verificar status da letra no teclado
  const getKeyStatus = (key: string) => {
    let status = 'neutral';
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          if (targetWord[i] === key) return 'correct'; // Prioridade máxima
          if (targetWord.includes(key) && status !== 'correct') status = 'present';
          if (!targetWord.includes(key) && status === 'neutral') status = 'absent';
        }
      }
    }
    return status;
  };

  const renderRow = (guess: string | undefined, isCurrent: boolean) => {
    const letters = (guess || '').padEnd(WORD_LENGTH, ' ').split('');
    return (
      <div className="flex gap-1 sm:gap-2 justify-center mb-2">
        {letters.map((char, i) => {
          let status = 'neutral';
          if (!isCurrent && guess) {
            if (char === targetWord[i]) status = 'correct';
            else if (targetWord.includes(char)) status = 'present';
            else status = 'absent';
          }

          let styleClass = '';
          if (status === 'correct') styleClass = isSecretMode ? 'bg-pink-600 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
          else if (status === 'present') styleClass = 'bg-yellow-600 border-yellow-500 text-white';
          else if (status === 'absent') styleClass = 'bg-slate-800/50 border-slate-700 text-slate-500';
          else if (isCurrent && char !== ' ') styleClass = isSecretMode ? 'border-pink-500 text-pink-100 bg-pink-900/20' : 'border-emerald-500 text-emerald-100 bg-emerald-900/20';
          else styleClass = 'border-slate-700/50 text-slate-400 bg-slate-900/30';

          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                w-10 h-12 sm:w-12 sm:h-14 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-md font-mono
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl p-4 w-screen h-screen"
    >
      <div className={`
        relative rounded-2xl shadow-2xl w-full max-w-lg border flex flex-col overflow-hidden
        ${isSecretMode ? 'bg-black/80 border-pink-500/30 shadow-pink-500/10' : 'bg-slate-900/80 border-emerald-500/30 shadow-emerald-500/10'}
        h-[85vh] sm:h-auto ring-1 ring-white/5
      `}>
        {/* Header */}
        <div className={`flex-shrink-0 p-4 border-b flex justify-between items-center ${isSecretMode ? 'border-pink-500/10 bg-pink-900/10' : 'border-emerald-500/10 bg-emerald-900/10'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isSecretMode ? 'bg-pink-500/10 text-pink-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {isSecretMode ? <ShieldAlert size={20} /> : <Terminal size={20} />}
                </div>
                <div>
                    <h2 className={`text-lg font-bold font-mono tracking-wider ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'}`}>
                        {isSecretMode ? 'SYSTEM HACK' : 'CODE BREAKER'}
                    </h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Adivinhe a senha</p>
                </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowHelp(!showHelp)} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition"><HelpCircle size={20} /></button>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition"><X size={20} /></button>
            </div>
        </div>

        {/* Tutorial */}
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-950/50 px-6 py-3 text-sm text-slate-300 border-b border-white/5"
            >
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex items-center gap-3"><span className={`w-3 h-3 rounded shadow ${isSecretMode ? 'bg-pink-600' : 'bg-emerald-600'}`}></span> <span className="text-white font-bold">Letra certa</span></li>
                <li className="flex items-center gap-3"><span className="w-3 h-3 rounded bg-yellow-600 shadow"></span> <span className="text-white">Posição errada</span></li>
                <li className="flex items-center gap-3"><span className="w-3 h-3 rounded bg-slate-700 shadow"></span> <span className="text-slate-500">Incorreto</span></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Area */}
        <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-black/20">
          <div className="w-full max-w-sm space-y-1.5">
            {guesses.map((g, i) => renderRow(g, false))}
            {gameState === 'playing' && renderRow(currentGuess, true)}
            {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length))].map((_, i) => renderRow('', false))}
          </div>
        </div>

        {/* Footer & Keyboard */}
        <div className={`flex-shrink-0 p-3 border-t backdrop-blur-md ${isSecretMode ? 'bg-pink-950/10 border-pink-500/10' : 'bg-emerald-950/10 border-emerald-500/10'}`}>
            {gameState !== 'playing' && (
              <div className={`text-center animate-fade-in mb-3 p-2 rounded-lg border ${isSecretMode ? 'bg-pink-500/10 border-pink-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                <p className={`font-bold text-base mb-2 ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'} font-mono`}>
                  {gameState === 'won' ? 'ACESSO LIBERADO 🔓' : `SENHA: ${targetWord}`}
                </p>
                <button onClick={startNewGame} className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-white font-bold shadow-lg transition w-full hover:scale-[1.02] active:scale-[0.98] text-xs uppercase ${isSecretMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                  <RotateCcw size={16} /> JOGAR NOVAMENTE
                </button>
              </div>
            )}

            <div className="grid grid-cols-10 gap-1 select-none">
              {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                <div key={i} className="col-span-10 flex justify-center gap-1">
                  {row.split('').map(char => {
                    const status = getKeyStatus(char);
                    let keyColor = isSecretMode ? 'bg-slate-800 hover:bg-pink-900/40 text-slate-300' : 'bg-slate-800 hover:bg-emerald-900/40 text-slate-300';
                    if (status === 'correct') keyColor = isSecretMode ? 'bg-pink-600 text-white border-pink-500' : 'bg-emerald-600 text-white border-emerald-500';
                    if (status === 'present') keyColor = 'bg-yellow-600 text-white border-yellow-500';
                    if (status === 'absent') keyColor = 'bg-slate-900 text-slate-600 border-slate-800';

                    return (
                      <button 
                        key={char} 
                        onClick={() => handleKeyDown(char)} 
                        className={`
                          h-9 flex-1 min-w-[20px] text-[10px] sm:text-xs rounded font-bold transition-all active:scale-90 border-b-2 border-transparent
                          ${keyColor}
                        `}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="col-span-10 flex justify-center gap-2 mt-1">
                <button onClick={() => handleKeyDown('BACKSPACE')} className="h-9 px-3 bg-slate-700 text-white rounded text-[10px] font-bold hover:bg-red-600/80 transition-colors flex-1 max-w-[80px] border-b-2 border-black/20 active:border-b-0 active:translate-y-px">DEL</button>
                <button onClick={() => handleKeyDown('ENTER')} className={`h-9 px-3 text-white rounded text-[10px] font-bold transition-colors flex-1 max-w-[80px] border-b-2 border-black/20 active:border-b-0 active:translate-y-px ${isSecretMode ? 'bg-pink-700 hover:bg-pink-600' : 'bg-emerald-700 hover:bg-emerald-600'}`}>ENTER</button>
              </div>
            </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
