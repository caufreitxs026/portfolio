'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Terminal, ShieldAlert } from 'lucide-react';

// Palavras Padrão (6 letras)
const NORMAL_WORDS = [
  'PYTHON',
  'DOCKER',
  'CODING',
  'DEPLOY',
  'SERVER',
  'NEXTJS',
  'UBUNTU',
  'GOLANG',
  'REACTS',
  'NODEJS',
  'SCRIPT',
  'KERNEL',
  'CLIENT',
  'APIKEY'
];

// Palavras do Modo Secreto (6 letras)
const SECRET_WORDS = [
  'MATRIX',
  'ACCESS',
  'SECURE',
  'HACKER',
  'BYPASS',
  'HIDDEN',
  'SYSTEM',
  'TROJAN',
  'BINARY',
  'ROOTED',
  'KEYLOG',
  'BOTNET',
  'INJECT',
  'DECODE',
  'ENCODE'
];

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 6;

export default function TechWordle({ onClose }: { onClose: () => void }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [isSecretMode, setIsSecretMode] = useState(false);

  // Detecta se o modo secreto está ativo ao abrir o jogo
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const secretActive = document.body.classList.contains('secret-mode');
      setIsSecretMode(secretActive);
      // Bloqueia o scroll da página enquanto o jogo estiver aberto
      document.body.style.overflow = 'hidden';
    }
    return () => {
      // Restaura o scroll ao fechar
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Seleciona a lista de palavras baseada no modo
  const gameWords = useMemo(() => isSecretMode ? SECRET_WORDS : NORMAL_WORDS, [isSecretMode]);

  // Inicia o jogo apenas depois de saber o modo (para evitar hidratação incorreta)
  useEffect(() => {
    if (gameWords.length > 0 && !targetWord) {
      startNewGame();
    }
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

  const renderRow = (guess: string | undefined, isCurrent: boolean) => {
    const letters = (guess || '').padEnd(WORD_LENGTH, ' ').split('');
    
    return (
      <div className="flex gap-2 justify-center mb-2">
        {letters.map((char, i) => {
          let status = 'neutral';
          if (!isCurrent && guess) {
            if (char === targetWord[i]) status = 'correct';
            else if (targetWord.includes(char)) status = 'present';
            else status = 'absent';
          }

          return (
            <motion.div
              key={i}
              initial={isCurrent && char !== ' ' ? { scale: 1.2 } : { scale: 1 }}
              animate={{ scale: 1 }}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center text-xl font-bold rounded font-mono
                ${isCurrent ? 'border-current text-white' : ''}
                ${status === 'neutral' && !isCurrent ? 'border-slate-700 text-slate-500' : ''}
                ${status === 'correct' ? 'bg-emerald-600 border-emerald-600 text-white' : ''}
                ${status === 'present' ? 'bg-yellow-600 border-yellow-600 text-white' : ''}
                ${status === 'absent' ? 'bg-slate-800 border-slate-800 text-slate-400' : ''}
              `}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 overflow-hidden"
    >
      <div className={`
        relative rounded-xl p-6 shadow-2xl max-w-lg w-full border flex flex-col max-h-[90vh] overflow-y-auto
        ${isSecretMode ? 'bg-black border-pink-500 shadow-pink-500/20' : 'bg-slate-900 border-emerald-500/30'}
      `}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className={`
            text-2xl font-bold font-mono flex items-center justify-center gap-2
            ${isSecretMode ? 'text-pink-500 glitch-text' : 'text-emerald-400'}
          `}>
            {isSecretMode ? <ShieldAlert size={24} /> : <Terminal size={24} />}
            {isSecretMode ? 'SYSTEM HACK' : 'CODE BREAKER'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isSecretMode ? 'Acesso root detectado. Descriptografe a senha.' : 'Descubra a palavra secreta do sistema.'}
          </p>
        </div>

        <div className="mb-6 flex-grow flex flex-col justify-center">
          {guesses.map((g, i) => renderRow(g, false))}
          {gameState === 'playing' && renderRow(currentGuess, true)}
          {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length))].map((_, i) => renderRow('', false))}
        </div>

        {gameState !== 'playing' && (
          <div className="text-center animate-fade-in mb-4">
            {gameState === 'won' ? (
              <p className={`font-bold text-xl mb-4 ${isSecretMode ? 'text-pink-400' : 'text-emerald-400'}`}>
                {isSecretMode ? 'ROOT ACCESS GRANTED! 🔓' : 'ACESSO CONCEDIDO! 🔓'}
              </p>
            ) : (
              <p className="text-red-400 font-bold text-xl mb-4">
                FALHA NO SISTEMA. A senha era: {targetWord}
              </p>
            )}
            <button 
              onClick={startNewGame}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold shadow-lg transition mx-auto
                ${isSecretMode ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}
              `}
            >
              <RotateCcw size={20} /> Reiniciar
            </button>
          </div>
        )}

        {/* Teclado Virtual */}
        <div className="mt-auto grid grid-cols-10 gap-1 sm:gap-2">
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
            <div key={i} className="col-span-10 flex justify-center gap-1">
              {row.split('').map(char => (
                <button
                  key={char}
                  onClick={() => handleKeyDown(char)}
                  className={`w-7 h-9 sm:w-8 sm:h-10 text-xs sm:text-sm text-slate-300 rounded font-bold transition-colors
                    ${isSecretMode ? 'bg-slate-800 hover:bg-pink-900/50' : 'bg-slate-800 hover:bg-slate-700'}
                  `}
                >
                  {char}
                </button>
              ))}
            </div>
          ))}
          <div className="col-span-10 flex justify-center gap-2 mt-2">
             <button onClick={() => handleKeyDown('BACKSPACE')} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs hover:bg-red-900/50 transition-colors">DEL</button>
             <button 
                onClick={() => handleKeyDown('ENTER')} 
                className={`px-4 py-2 text-white rounded text-xs font-bold transition-colors ${isSecretMode ? 'bg-pink-700 hover:bg-pink-600' : 'bg-emerald-700 hover:bg-emerald-600'}`}
             >
                ENTER
             </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
