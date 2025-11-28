
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  const { theme } = useTheme();
  
  // Stronger definition for light mode: slate-200 border, darker text, slightly stronger shadow
  const glassStyle = theme.isDark
    ? `${theme.glassColor} border-white/10 text-white shadow-2xl shadow-black/40`
    : `${theme.glassColor} border-slate-200/60 text-slate-950 shadow-xl shadow-slate-200/50`;

  const hoverStyle = theme.isDark
    ? `hover:bg-${theme.accent}-900/60 hover:border-${theme.accent}-500/40`
    : 'hover:bg-white/95 hover:border-slate-300';

  return (
    <motion.div
      className={`backdrop-blur-[20px] rounded-3xl p-6 border transition-colors ${glassStyle} ${hoverEffect ? hoverStyle : ''} ${className}`}
      whileHover={hoverEffect ? { scale: 1.01, y: -4 } : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

interface FloatingOrbProps {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({ color, size, top, left, delay }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-screen filter blur-3xl opacity-60 pointer-events-none z-0 ${color} ${size}`}
    style={{ top, left }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({ children, onClick, variant = 'primary', className = '', type = "button", disabled = false }) => {
  const { theme } = useTheme();

  const primaryStyle = `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-lg hover:brightness-110 hover:shadow-xl`;
  const secondaryStyle = theme.isDark
    ? `bg-white/10 border border-white/20 text-white hover:bg-white/20`
    : `bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 hover:bg-white hover:border-slate-300 font-bold`;

  const baseStyles = "relative px-8 py-3 rounded-xl font-bold transition-all transform overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    </motion.button>
  );
};
