
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveCat = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleInteract = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000); // Reset after animation
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
           Play with me! 🧶
        </div>

        <motion.div
          className="relative cursor-pointer w-24 h-24"
          onClick={handleInteract}
          whileHover={{ scale: 1.05 }}
        >
          {/* Yarn Ball */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ x: 60, y: 0, opacity: 0, rotate: 0 }}
                animate={{ x: [60, -20, 60], y: [0, -10, 0], opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-400 z-50 border-2 border-red-300 shadow-sm flex items-center justify-center"
              >
                 <div className="w-full h-px bg-red-200 rotate-45 absolute" />
                 <div className="w-full h-px bg-red-200 -rotate-45 absolute" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cat Container */}
          <motion.div
             animate={isPlaying ? { 
                y: [0, -30, 0], 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
             } : {
                y: [0, 2, 0] // Breathing idle
             }}
             transition={isPlaying ? { duration: 0.6, repeat: 2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="relative w-full h-full"
          >
              {/* Tail */}
              <motion.div 
                 className="absolute bottom-2 right-2 w-12 h-12 border-4 border-slate-700 rounded-full border-t-transparent border-l-transparent origin-bottom-left"
                 animate={{ rotate: [0, 10, 0, -5, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* Body */}
              <div className="absolute bottom-0 left-2 w-16 h-12 bg-white border-2 border-slate-200 rounded-2xl shadow-sm z-10" />

              {/* Head */}
              <div className="absolute top-4 left-0 w-14 h-12 bg-white border-2 border-slate-200 rounded-2xl z-20 flex flex-col items-center justify-center shadow-sm">
                  {/* Ears */}
                  <div className="absolute -top-3 -left-1 w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-slate-200 border-r-[10px] border-r-transparent -rotate-12" />
                  <div className="absolute -top-3 left-1 w-0 h-0 border-l-[8px] border-l-transparent border-b-[12px] border-b-pink-200 border-r-[8px] border-r-transparent -rotate-12" />
                  
                  <div className="absolute -top-3 -right-1 w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-slate-200 border-r-[10px] border-r-transparent rotate-12" />
                  <div className="absolute -top-3 right-1 w-0 h-0 border-l-[8px] border-l-transparent border-b-[12px] border-b-pink-200 border-r-[8px] border-r-transparent rotate-12" />

                  {/* Face */}
                  <div className="flex gap-3 mt-1">
                      <motion.div 
                        className="w-1.5 h-1.5 bg-slate-800 rounded-full" 
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-slate-800 rounded-full" 
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                  </div>
                  <div className="w-2 h-1 bg-pink-300 rounded-full mt-1" />
                  {/* Whiskers */}
                  <div className="absolute top-6 -left-3 w-4 h-px bg-slate-300 rotate-12" />
                  <div className="absolute top-7 -left-3 w-4 h-px bg-slate-300 -rotate-6" />
                  <div className="absolute top-6 -right-3 w-4 h-px bg-slate-300 -rotate-12" />
                  <div className="absolute top-7 -right-3 w-4 h-px bg-slate-300 rotate-6" />
              </div>

              {/* Paws */}
              <div className="absolute bottom-0 left-4 w-3 h-3 bg-white border border-slate-200 rounded-full z-20" />
              <div className="absolute bottom-0 left-9 w-3 h-3 bg-white border border-slate-200 rounded-full z-20" />
          </motion.div>
        </motion.div>
        
        <div className="w-14 h-3 bg-black/10 blur-sm rounded-full absolute bottom-1 left-3 z-0" />
      </div>
    </div>
  );
};
