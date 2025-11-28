
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Activity, MessageCircle, Shield } from 'lucide-react';
import { GlassCard, Button3D } from '../components/ui/GlassComponents';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('bloom_user');
      setIsLoggedIn(!!stored);
    };
    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const badgeStyle = theme.isDark 
    ? `bg-white/10 border-white/20 text-${theme.accent}-300` 
    : `bg-white/70 border-white/60 text-${theme.accent}-800`;

  const gradientText = `text-transparent bg-clip-text bg-gradient-to-r ${theme.buttonGradient}`;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left z-10"
        >
          <div className={`inline-block mb-4 px-4 py-1.5 rounded-full backdrop-blur-md border font-bold text-sm shadow-sm ${badgeStyle}`}>
            ✨ Your Daily Dose of Calm
          </div>
          <h1 className={`font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-sm ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            Grow Emotionally. <br />
            <span className={gradientText}>
              Shine Mentally.
            </span>
          </h1>
          <p className={`text-lg font-medium mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-800'}`}>
            Your personal sanctuary for mental wellness. Track your moods, chat with an empathetic AI companion, and discover tools to help you bloom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {isLoggedIn ? (
               <>
                <Link to="/dashboard">
                  <Button3D>Go to Dashboard</Button3D>
                </Link>
                <Link to="/journal">
                  <Button3D variant="secondary">Write Journal</Button3D>
                </Link>
               </>
            ) : (
               <>
                <Link to="/auth">
                  <Button3D>Get Started Free</Button3D>
                </Link>
                <Link to="/bot">
                  <Button3D variant="secondary">Try EmpathyBot</Button3D>
                </Link>
               </>
            )}
          </div>
        </motion.div>

        {/* 3D Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] w-full flex items-center justify-center z-10"
        >
          {/* Main Floating Card */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative w-72 md:w-80 aspect-[9/16] backdrop-blur-2xl border rounded-[2.5rem] shadow-2xl p-6 flex flex-col ${theme.isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}
          >
            {/* Mock Phone UI */}
            <div className="w-12 h-1 bg-slate-400 rounded-full mx-auto mb-6" />
            <div className="flex-1 space-y-4">
              <div className={`h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br ${theme.buttonGradient} opacity-90 shadow-md`}>
                 <span className="text-4xl">🌿</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-300/50 rounded-full" />
                <div className="h-4 w-1/2 bg-slate-300/50 rounded-full" />
              </div>
              <div className={`mt-8 p-4 rounded-xl border ${theme.isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white/70 border-slate-200'}`}>
                 <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>Mood</span>
                    <span className="text-xs text-slate-500 font-bold">Today</span>
                 </div>
                 <div className="flex justify-between text-2xl">
                    <span>😔</span>
                    <span>😐</span>
                    <span className="scale-125 drop-shadow-lg">🙂</span>
                    <span>😄</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [10, -10, 10], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className={`absolute top-20 -left-4 md:left-10 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${theme.isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="bg-green-100 p-2 rounded-full text-green-700"><Activity size={20}/></div>
            <div>
              <p className={`text-xs font-bold ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stress Level</p>
              <p className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Dropped 15%</p>
            </div>
          </motion.div>

          <motion.div 
             animate={{ y: [-15, 15, -15], rotate: [0, -5, 0] }}
             transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
             className={`absolute bottom-32 -right-4 md:right-10 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${theme.isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}
          >
            <div className="bg-pink-100 p-2 rounded-full text-pink-600"><Heart size={20} className="fill-current"/></div>
            <div>
              <p className={`text-xs font-bold ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mood</p>
              <p className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Feeling Great</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      title: "Mood Journal",
      description: "Track your emotional journey with our beautiful, glass-styled daily journal.",
      icon: <span className="text-4xl">📔</span>,
      link: "/journal"
    },
    {
      title: "EmpathyBot AI",
      description: "A safe space to talk 24/7. Non-judgmental, kind, and always there for you.",
      icon: <span className="text-4xl">🤖</span>,
      link: "/bot"
    },
    {
      title: "Bloom Library",
      description: "Curated videos and professional contacts to help you understand your mind.",
      icon: <span className="text-4xl">📺</span>,
      link: "/library"
    }
  ];

  const linkColor = theme.isDark ? `text-${theme.accent}-400` : `text-${theme.accent}-700`;

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`font-display text-4xl font-bold mb-4 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Why BloomMind?</h2>
          <p className={`text-lg max-w-2xl mx-auto font-medium ${theme.isDark ? 'text-slate-400' : 'text-slate-800'}`}>We combine gentle design with powerful psychology to help you build resilience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <GlassCard key={idx} className="flex flex-col items-center text-center p-8">
              <div className={`mb-6 p-4 rounded-full shadow-inner border ${theme.isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-white/70 border-slate-200'}`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
              <p className={`mb-6 leading-relaxed font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>{feature.description}</p>
              <Link to={feature.link} className={`mt-auto font-bold flex items-center gap-2 hover:gap-3 transition-all ${linkColor}`}>
                Try it <ArrowRight size={16} />
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
};
