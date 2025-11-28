
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StressReliever = () => {
  const [isSquished, setIsSquished] = useState(false);
  const [mood, setMood] = useState<'happy' | 'surprised' | 'dizzy'>('happy');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePoke = () => {
    setIsSquished(true);
    setMood(prev => prev === 'happy' ? 'surprised' : prev === 'surprised' ? 'dizzy' : 'happy');
    setTimeout(() => setIsSquished(false), 200);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
           Poke me! I'm squishy!
        </div>

        <motion.div
          className="w-20 h-20 cursor-pointer relative"
          onClick={handlePoke}
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={{ 
            scale: isSquished ? [1, 1.2, 0.8, 1] : 1,
            y: [0, -10, 0],
          }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.2 } 
          }}
          drag
          dragConstraints={{ left: 0, right: 200, top: -200, bottom: 0 }}
          onDragEnd={() => setPosition({ x: 0, y: 0 })}
        >
          {/* Body */}
          <div className={`w-full h-full rounded-full shadow-lg transition-colors duration-300 relative overflow-hidden
            ${mood === 'happy' ? 'bg-gradient-to-tr from-pink-300 to-purple-400' : 
              mood === 'surprised' ? 'bg-gradient-to-tr from-orange-300 to-yellow-400' : 
              'bg-gradient-to-tr from-blue-300 to-green-400'}`}
          >
             {/* Shine */}
             <div className="absolute top-2 right-4 w-6 h-4 bg-white/40 rounded-full blur-sm transform -rotate-45" />
             
             {/* Face */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center gap-2 items-center">
                {mood === 'happy' && (
                  <>
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-2 h-1 bg-slate-800 rounded-full absolute top-10" />
                  </>
                )}
                {mood === 'surprised' && (
                   <>
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="w-4 h-4 border-2 border-slate-800 rounded-full absolute top-8" />
                   </>
                )}
                {mood === 'dizzy' && (
                   <>
                    <div className="text-slate-800 font-bold text-xs">X</div>
                    <div className="text-slate-800 font-bold text-xs">X</div>
                    <div className="w-4 h-1 bg-slate-800 rounded-full absolute top-10" />
                   </>
                )}
             </div>
          </div>
        </motion.div>
        
        <div className="w-16 h-4 bg-black/10 blur-md rounded-full absolute -bottom-2 left-2 animate-pulse" />
      </div>
    </div>
  );
};
