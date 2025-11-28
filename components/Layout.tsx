
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Smile, MessageCircle, BarChart2, BookOpen, Home, LogOut, User as UserIcon, Palette, Settings } from 'lucide-react';
import { FloatingOrb } from './ui/GlassComponents';
import { InteractiveCat } from './ui/InteractiveCat';
import { GridPattern, FloatingWords } from './ui/BackgroundElements';
import { CommunityPulse } from './ui/CommunityPulse';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const glowColor = theme.name === 'midnight' 
    ? 'rgba(139, 92, 246, 0.15)' 
    : theme.name === 'forest' ? 'rgba(52, 211, 153, 0.15)'
    : theme.name === 'ocean' ? 'rgba(6, 182, 212, 0.15)' 
    : theme.name === 'emerald' ? 'rgba(16, 185, 129, 0.15)'
    : theme.name === 'energy' ? 'rgba(249, 115, 22, 0.15)' 
    : 'rgba(139, 92, 246, 0.15)';

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 overflow-hidden"
      style={{ 
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 40%)` 
      }}
    />
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, availableThemes } = useTheme();

  const checkUser = () => {
    const storedUser = localStorage.getItem('bloom_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bloom_user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
    setIsOpen(false);
  };

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Journal', path: '/journal', icon: Smile },
    { name: 'EmpathyBot', path: '/bot', icon: MessageCircle },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Library', path: '/library', icon: BookOpen },
  ];

  const navBg = theme.isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200/70';
  const textColor = theme.isDark ? 'text-slate-300' : 'text-slate-700';
  const activeColor = theme.isDark ? `text-${theme.accent}-400` : `text-${theme.accent}-800`;

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className={`${navBg} backdrop-blur-xl border rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg relative transition-colors duration-300`}>
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${theme.name === 'ocean' ? 'from-cyan-400 to-blue-500' : theme.name === 'energy' ? 'from-orange-400 to-red-500' : (theme.name === 'emerald' || theme.name === 'forest') ? 'from-emerald-400 to-teal-500' : 'from-sky-400 to-purple-500'} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className={`font-display font-bold text-xl tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>BloomMind</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                  location.pathname === link.path
                    ? activeColor
                    : `${textColor} hover:${activeColor}`
                }`}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 rounded-full transition-colors ${theme.isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}
                title="Change Theme"
              >
                <Palette size={18} />
              </button>
              
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-12 right-0 p-2 rounded-xl shadow-xl min-w-[150px] flex flex-col gap-1 border ${theme.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                  >
                    {availableThemes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => { setTheme(t.name); setShowThemeMenu(false); }}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                            theme.name === t.name 
                                ? (theme.isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900') 
                                : (theme.isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                            t.name === 'ocean' ? 'from-cyan-400 to-blue-500' : 
                            t.name === 'energy' ? 'from-orange-400 to-red-500' : 
                            (t.name === 'emerald' || t.name === 'forest') ? 'from-emerald-400 to-teal-500' :
                            t.name === 'midnight' ? 'from-indigo-600 to-purple-800' : 'from-purple-400 to-pink-500'}`} 
                        />
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {user ? (
              <div className={`flex items-center gap-4 border-l pl-6 ${theme.isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className={`w-8 h-8 rounded-full ${theme.isDark ? `bg-${theme.accent}-900 text-${theme.accent}-300` : `bg-${theme.accent}-100 text-${theme.accent}-700`} flex items-center justify-center font-bold text-sm border border-${theme.accent}-200 overflow-hidden`}>
                     {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="User" /> : user.name.charAt(0)}
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-colors ${theme.isDark ? 'hover:bg-red-900/30 text-slate-300 hover:text-red-400' : 'hover:bg-red-50 text-slate-600 hover:text-red-600'}`}
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   className={`px-5 py-2 rounded-xl text-sm font-semibold shadow-lg ${theme.isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                 >
                   Sign In
                 </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className={`md:hidden ${theme.isDark ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-20 left-6 right-6 rounded-3xl p-6 shadow-2xl border md:hidden backdrop-blur-xl ${theme.isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}
            >
              <div className="flex flex-col gap-4">
                {user && (
                   <Link to="/profile" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-2 border-b pb-4 mb-2 ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className={`w-10 h-10 rounded-full ${theme.isDark ? `bg-${theme.accent}-900 text-${theme.accent}-300` : `bg-${theme.accent}-100 text-${theme.accent}-600`} flex items-center justify-center font-bold overflow-hidden`}>
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="User" /> : user.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                        <p className={`text-xs ${theme.isDark ? 'text-slate-400' : 'text-slate-600'}`}>View Profile</p>
                      </div>
                   </Link>
                )}
                
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-lg font-bold p-2 rounded-xl ${theme.isDark ? 'text-slate-200 hover:bg-slate-800' : `text-slate-800 hover:bg-${theme.accent}-50`}`}
                  >
                    <link.icon size={20} className={`text-${theme.accent}-600`} />
                    {link.name}
                  </Link>
                ))}

                 {/* Mobile Theme Switcher */}
                 <div className="flex gap-2 justify-center py-2 flex-wrap">
                    {availableThemes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => { setTheme(t.name); }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${theme.name === t.name ? `bg-${t.accent}-600 text-white border-${t.accent}-600` : 'bg-transparent text-slate-600 border-slate-300'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                 </div>
                
                <div className={`h-px my-2 ${theme.isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-lg font-bold text-red-600 p-2 hover:bg-red-50 rounded-xl w-full text-left"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)} className={`text-center font-bold text-${theme.accent}-700 py-2`}>
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`relative min-h-screen overflow-hidden font-sans selection:bg-purple-500 selection:text-white transition-colors duration-500 ${theme.isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <CursorGlow />
      <InteractiveCat />
      <CommunityPulse />
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} animate-gradient-x`}></div>
        <GridPattern />
        <FloatingWords />
        <FloatingOrb color={theme.orbColors[0]} size="w-96 h-96" top="-10%" left="-10%" delay={0} />
        <FloatingOrb color={theme.orbColors[1]} size="w-80 h-80" top="40%" left="80%" delay={2} />
        <FloatingOrb color={theme.orbColors[2]} size="w-[500px] h-[500px]" top="70%" left="-20%" delay={4} />
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 min-h-screen">
        {children}
      </main>

      <footer className={`relative z-10 backdrop-blur-lg border-t mt-20 transition-colors ${theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className={`font-display font-bold text-2xl ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>BloomMind</h3>
              <p className={`mt-2 font-medium ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>Grow Emotionally. Shine Mentally.</p>
            </div>
            <div className={`flex gap-6 font-medium ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              <a href="#" className={`hover:text-${theme.accent}-500 transition-colors`}>Privacy</a>
              <a href="#" className={`hover:text-${theme.accent}-500 transition-colors`}>Terms</a>
              <a href="#" className={`hover:text-${theme.accent}-500 transition-colors`}>Contact</a>
            </div>
          </div>
          <div className={`mt-8 text-center text-sm ${theme.isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            © {new Date().getFullYear()} BloomMind Wellness. Built with 💜 and AI.
          </div>
        </div>
      </footer>
    </div>
  );
};
