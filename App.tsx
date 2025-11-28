
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { Journal } from './pages/Journal';
import { EmpathyBot } from './pages/EmpathyBot';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

const AnimatedRoutes = () => {
  const location = useLocation();

  // Mind-blowing transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95, 
      rotateX: -5 
    },
    enter: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for "pop" effect
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -50, 
      scale: 1.05, 
      filter: "blur(10px)",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full perspective-1000" // Add perspective for 3D rotation effect
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/bot" element={<EmpathyBot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}
