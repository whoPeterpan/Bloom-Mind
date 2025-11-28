
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const GridPattern = () => {
  const { theme } = useTheme();
  const strokeColor = theme.name === 'midnight' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0" 
         style={{ backgroundImage: `radial-gradient(${strokeColor} 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }}>
    </div>
  );
};

export const FloatingWords = () => {
    const words = ["Breathe", "Relax", "Grow", "Heal", "Smile", "Calm", "Focus", "Bloom"];
    const { theme } = useTheme();
    const textColor = theme.name === 'midnight' ? 'text-white/5' : 'text-slate-900/5';

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
            {words.map((word, i) => (
                <motion.div
                    key={i}
                    className={`absolute text-6xl md:text-9xl font-display font-bold ${textColor}`}
                    initial={{ x: Math.random() * 80 + 'vw', y: 110 + 'vh', opacity: 0 }}
                    animate={{ 
                        y: [110 + 'vh', -200],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{ 
                        duration: 25 + Math.random() * 20, 
                        repeat: Infinity, 
                        delay: i * 3,
                        ease: "linear"
                    }}
                    style={{ left: `${(i / words.length) * 80}%` }}
                >
                    {word}
                </motion.div>
            ))}
        </div>
    )
}
