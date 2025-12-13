'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Terminal, ShieldAlert, HelpCircle } from 'lucide-react';

const NORMAL_WORDS = [
  'PYTHON', 'DOCKER', 'CODING', 'DEPLOY', 'SERVER', 'NEXTJS', 'UBUNTU', 
  'GOLANG', 'REACTS', 'NODEJS', 'SCRIPT', 'KERNEL', 'CLIENT', 'APIKEY'
];

const SECRET_WORDS = [
  'MATRIX', 'ACCESS', 'SECURE', 'HACKER', 'BYPASS', 'HIDDEN', 'SYSTEM', 
  'TROJAN', 'BINARY', 'ROOTED', 'KEYLOG', 'BOTNET', 'INJECT', 'DECODE', 'ENCODE'
];

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
      const secretActive = document.body.classList.contains('secret-mode');
      setIsSecretMode(secretActive);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const gameWords = useMemo(() => isSecretMode ? SECRET_WORDS : NORMAL_WORDS, [isSecretMode]);

  useEffect(() => {
    if (gameWords.length > 0 && !targetWord) {
      startNewGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameWords]);

  const startNewGame = () => {
    if (gameWords.length === 0) return;
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

          let bgColor = isSecretMode ? 'border-pink-900/50' : 'border-slate-700';
          if (status === 'correct') bgColor = isSecretMode ? 'bg-pink-600 border-pink-600' : 'bg-emerald-600 border-emerald-600';
          if (status === 'present') bgColor = 'bg-yellow-600 border-yellow-600';
          if (status === 'absent') bgColor = 'bg-slate-800 border-slate-800';

          return (
            <motion.div
              key={i}
              initial={isCurrent && char !== ' ' ? { scale: 1.2 } : { scale: 1 }}
              animate={{ scale: 1 }}
              className={`
                w-8 h-8 sm:w-12 sm:h-12 border-2 flex items-center justify-center text-lg sm:text-xl font-bold rounded font-mono transition-colors
                ${isCurrent ? (isSecretMode ? 'border-pink-500 text-white' : 'border-emerald-500 text-white') : ''}
                ${status === 'neutral' && !isCurrent ? 'text-slate-500' : 'text-white'}
                ${bgColor}
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <div className={`
        relative rounded-xl shadow-2xl w-full max-w-lg border flex flex-col
        ${isSecretMode ? 'bg-black border-pink-500 shadow-pink-500/20' : 'bg-slate-900 border-emerald-500/30'}
        h-[85vh] sm:h-auto sm:max-h-[90vh]
      `}>
        {/* Cabeçalho Fixo */}
        <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
            <h2 className={`
              text-xl font-bold font-mono flex items-center gap-2
              ${isSecretMode ? 'text-pink-500 glitch-text' : 'text-emerald-400'}
            `}>
              {isSecretMode ? <ShieldAlert size={20} /> : <Terminal size={20} />}
              {isSecretMode ? 'SYSTEM HACK' : 'CODE BREAKER'}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowHelp(!showHelp)} className="text-slate-400 hover:text-white transition-colors">
                <HelpCircle size={20} />
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
        </div>

        {/* Tutorial (Toggle) */}
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-800/50 p-4 text-sm text-slate-300 overflow-hidden flex-shrink-0 border-b border-white/5"
            >
              <p className="font-bold mb-2 text-white">Guia de Cores:</p>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded ${isSecretMode ? 'bg-pink-600' : 'bg-emerald-600'}`}></span> 
                  Letra certa no lugar certo.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-yellow-600"></span> 
                  Letra certa, lugar errado.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-700"></span> 
                  Letra não existe.
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Área do Jogo (Rolável) */}
        <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar flex flex-col items-center">
          {guesses.map((g, i) => renderRow(g, false))}
          {gameState === 'playing' && renderRow(currentGuess, true)}
          {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length))].map((_, i) => renderRow('', false))}
        </div>

        {/* Rodapé Fixo (Status + Teclado) */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/20">
            {/* Status e Reiniciar */}
            {gameState !== 'playing' && (
              <div className="text-center animate-fade-in mb-3">
                <p className={`font-bold text-lg mb-2 ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'}`}>
                  {gameState === 'won' 
                    ? (isSecretMode ? 'ROOT ACCESS GRANTED!' : 'ACESSO CONCEDIDO!') 
                    : `SENHA: ${targetWord}`
                  }
                </p>
                <button 
                  onClick={startNewGame}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-lg text-white font-bold shadow-lg transition mx-auto text-sm
                    ${isSecretMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-emerald-600 hover:bg-emerald-500'}
                  `}
                >
                  <RotateCcw size={16} /> Reiniciar Jogo
                </button>
              </div>
            )}

            {/* Teclado Virtual */}
            <div className="grid grid-cols-10 gap-1 select-none">
              {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                <div key={i} className="col-span-10 flex justify-center gap-1">
                  {row.split('').map(char => (
                    <button
                      key={char}
                      onClick={() => handleKeyDown(char)}
                      className={`
                        h-9 sm:h-10 flex-1 min-w-[20px] max-w-[40px] text-xs sm:text-sm text-slate-300 rounded font-bold transition-colors active:scale-95
                        ${isSecretMode ? 'bg-slate-800 hover:bg-pink-900/50' : 'bg-slate-800 hover:bg-slate-700'}
                      `}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
              <div className="col-span-10 flex justify-center gap-2 mt-1">
                <button onClick={() => handleKeyDown('BACKSPACE')} className="px-3 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold hover:bg-red-900/50 transition-colors flex-1 max-w-[100px]">DEL</button>
                <button 
                    onClick={() => handleKeyDown('ENTER')} 
                    className={`px-3 py-2 text-white rounded text-xs font-bold transition-colors flex-1 max-w-[100px] ${isSecretMode ? 'bg-pink-700 hover:bg-pink-600' : 'bg-emerald-700 hover:bg-emerald-600'}`}
                >
                    ENTER
                </button>
              </div>
            </div>
        </div>

      </div>
    </motion.div>,
    document.body
  );
}
