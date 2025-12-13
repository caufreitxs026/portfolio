'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Terminal } from 'lucide-react';

const WORDS = ['PYTHON', 'REACT', 'DOCKER', 'CLOUD', 'LINUX', 'CODING', 'DEPLOY', 'SERVER', 'SVELTE', 'NEXTJS'];
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 6; // Vamos filtrar palavras de 6 letras para simplificar ou adaptar a lógica

// Filtra palavras de 6 letras apenas
const GAME_WORDS = WORDS.filter(w => w.length === 6);

export default function TechWordle({ onClose }: { onClose: () => void }) {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
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

  // Escuta teclado físico
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

  // Renderiza uma linha de letras
  const renderRow = (guess: string | undefined, isCurrent: boolean) => {
    const letters = (guess || '').padEnd(WORD_LENGTH, ' ').split('');
    
    return (
      <div className="flex gap-2 justify-center mb-2">
        {letters.map((char, i) => {
          let status = 'neutral'; // neutral, correct, present, absent
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
                w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center text-xl font-bold rounded
                ${isCurrent ? 'border-emerald-500/50 text-white' : ''}
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 shadow-2xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-2">
            <Terminal size={24} /> CODE BREAKER
          </h2>
          <p className="text-slate-400 text-sm mt-1">Descubra a palavra secreta do sistema.</p>
        </div>

        <div className="mb-6">
          {/* Tentativas Anteriores */}
          {guesses.map((g, i) => renderRow(g, false))}
          
          {/* Tentativa Atual */}
          {gameState === 'playing' && renderRow(currentGuess, true)}
          
          {/* Linhas Vazias Restantes */}
          {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length))].map((_, i) => renderRow('', false))}
        </div>

        {/* Mensagens de Fim de Jogo */}
        {gameState !== 'playing' && (
          <div className="text-center animate-fade-in">
            {gameState === 'won' ? (
              <p className="text-emerald-400 font-bold text-xl mb-4">ACESSO CONCEDIDO! 🔓</p>
            ) : (
              <p className="text-red-400 font-bold text-xl mb-4">ACESSO NEGADO. A palavra era: {targetWord}</p>
            )}
            <button 
              onClick={startNewGame}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition font-bold shadow-lg shadow-emerald-500/20 mx-auto text-white"
            >
              <RotateCcw size={20} /> Reiniciar Sistema
            </button>
          </div>
        )}

        {/* Teclado Virtual (Para Mobile) */}
        <div className="mt-6 grid grid-cols-10 gap-1 sm:gap-2">
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
            <div key={i} className="col-span-10 flex justify-center gap-1">
              {row.split('').map(char => (
                <button
                  key={char}
                  onClick={() => handleKeyDown(char)}
                  className="w-7 h-9 sm:w-8 sm:h-10 text-xs sm:text-sm bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-bold"
                >
                  {char}
                </button>
              ))}
            </div>
          ))}
          <div className="col-span-10 flex justify-center gap-2 mt-2">
             <button onClick={() => handleKeyDown('BACKSPACE')} className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs">DEL</button>
             <button onClick={() => handleKeyDown('ENTER')} className="px-4 py-2 bg-emerald-700 text-white rounded text-xs">ENTER</button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
