
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, Button3D } from '../components/ui/GlassComponents';
import { PlayCircle, UserCheck, X, Play, Clock, Star, Heart, Volume2, Wind, Music, Headphones, FileText, Pause, Hand, Eye, Ear, Coffee, Cloud, PenTool, Trash2, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoResource, Psychologist, Article } from '../types';
import { useTheme } from '../context/ThemeContext';

export const Library = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'toolkits' | 'articles'>('resources');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [followedSpecialists, setFollowedSpecialists] = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  
  // --- Toolkit States ---
  const [activeToolkit, setActiveToolkit] = useState<'breathing' | 'grounding' | 'worry' | 'canvas' | null>(null);
  
  // Breathing State
  const [breathingStep, setBreathingStep] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  
  // Grounding State
  const [groundingStep, setGroundingStep] = useState(0);
  
  // Worry Release State
  const [worryInput, setWorryInput] = useState('');
  const [worries, setWorries] = useState<{id: number, text: string, x: number, y: number}[]>([]);

  // Zen Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasColor, setCanvasColor] = useState('#6366f1');

  // Audio Player State
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ['All', 'Anxiety', 'Meditation', 'Sleep', 'Confidence'];
  
  const videos: VideoResource[] = [
    { id: '1', title: "5 Minute Mindfulness", category: "Meditation", duration: "5:00", thumbnailUrl: "https://picsum.photos/400/225?random=1" },
    { id: '2', title: "Understanding Stress", category: "Anxiety", duration: "12:30", thumbnailUrl: "https://picsum.photos/400/225?random=2" },
    { id: '3', title: "Sleep Hygiene 101", category: "Sleep", duration: "8:45", thumbnailUrl: "https://picsum.photos/400/225?random=3" },
    { id: '4', title: "Building Self-Worth", category: "Confidence", duration: "15:20", thumbnailUrl: "https://picsum.photos/400/225?random=4" },
    { id: '5', title: "Deep Breathing Guide", category: "Anxiety", duration: "6:15", thumbnailUrl: "https://picsum.photos/400/225?random=5" },
    { id: '6', title: "Morning Positivity", category: "Confidence", duration: "10:00", thumbnailUrl: "https://picsum.photos/400/225?random=6" },
  ];

  const doctors: Psychologist[] = [
    { 
        id: 'd1', 
        name: "Dr. Sarah Chen", 
        specialty: "Clinical Psychologist", 
        imageUrl: "https://picsum.photos/100/100?random=10", 
        rating: 4.9,
        bio: "Dr. Chen specializes in cognitive behavioral therapy for anxiety disorders. With over 15 years of experience, she focuses on practical tools for everyday resilience.",
        languages: ["English", "Mandarin"],
        availability: "Mon, Wed, Fri" 
    },
    { 
        id: 'd2', 
        name: "Dr. James Wilson", 
        specialty: "CBT Specialist", 
        imageUrl: "https://picsum.photos/100/100?random=11", 
        rating: 4.8,
        bio: "Dr. Wilson helps patients navigate complex emotional landscapes through structured CBT techniques.",
        languages: ["English"],
        availability: "Tue, Thu"
    },
    { 
        id: 'd3', 
        name: "Dr. Emily Aris", 
        specialty: "Mindfulness Coach", 
        imageUrl: "https://picsum.photos/100/100?random=12", 
        rating: 5.0,
        bio: "Emily integrates Eastern mindfulness practices with Western psychology to help clients find peace.",
        languages: ["English", "Spanish"],
        availability: "Weekends"
    },
  ];

  const articles: Article[] = [
      {
          id: 'a1',
          title: "The Science of Gratitude",
          excerpt: "How being thankful rewires your brain for happiness.",
          category: "Wellness",
          readTime: "5 min",
          imageUrl: "https://picsum.photos/600/400?random=20"
      },
      {
          id: 'a2',
          title: "Grounding Techniques for Panic",
          excerpt: "5 simple steps to regain control when you feel overwhelmed.",
          category: "Anxiety",
          readTime: "3 min",
          imageUrl: "https://picsum.photos/600/400?random=21"
      },
      {
          id: 'a3',
          title: "Sleep Better Tonight",
          excerpt: "Why blue light is destroying your circadian rhythm.",
          category: "Sleep",
          readTime: "7 min",
          imageUrl: "https://picsum.photos/600/400?random=22"
      }
  ];

  const sounds = [
    { id: 'rain', label: 'Gentle Rain', icon: '🌧️', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c920aa5481.mp3?filename=rain-and-thunder-16705.mp3' },
    { id: 'ocean', label: 'Ocean Waves', icon: '🌊', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_1e3e8f856f.mp3?filename=ocean-waves-112906.mp3' },
    { id: 'forest', label: 'Forest Birds', icon: '🐦', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_a4632e23f0.mp3?filename=forest-birds-114512.mp3' },
    { id: 'fire', label: 'Crackling Fire', icon: '🔥', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d0.mp3?filename=fireplace-2122.mp3' },
  ];

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedSpecialists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePlaySound = (soundId: string, url: string) => {
    if (playingSound === soundId) {
        audioRef.current?.pause();
        setPlayingSound(null);
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.error("Audio play error", e));
        setPlayingSound(soundId);
    }
  };

  // Stop audio on unmount
  useEffect(() => {
      return () => {
          if (audioRef.current) audioRef.current.pause();
      };
  }, []);

  // Breathing Cycle Logic
  useEffect(() => {
    let interval: any;
    if (activeToolkit === 'breathing') {
        let timer = 0;
        interval = setInterval(() => {
            timer++;
            if (timer <= 4) setBreathingStep('Inhale');
            else if (timer <= 8) setBreathingStep('Hold');
            else if (timer <= 12) setBreathingStep('Exhale');
            else timer = 0;
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeToolkit]);

  // Worry Release Helper
  const addWorry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryInput.trim()) return;
    const newWorry = {
        id: Date.now(),
        text: worryInput,
        x: Math.random() * 60 + 20, // Random position
        y: 100 // Start at bottom
    };
    setWorries(prev => [...prev, newWorry]);
    setWorryInput('');
  };

  const popWorry = (id: number) => {
      setWorries(prev => prev.filter(w => w.id !== id));
      // Optional: Add pop sound effect here
  };

  // Zen Canvas Drawing
  const startDrawing = (e: React.MouseEvent) => {
      setIsDrawing(true);
      draw(e);
  };
  const stopDrawing = () => setIsDrawing(false);
  const draw = (e: React.MouseEvent) => {
      if (!isDrawing || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = canvasColor;

      // Draw symmetrical lines (Mandala effect)
      const symmetry = 6;
      for (let i = 0; i < symmetry; i++) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate((i * (Math.PI * 2)) / symmetry);
          ctx.translate(-centerX, -centerY);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY); // Simplified for this demo
          ctx.lineTo(x, y); 
          // Better logic: store last pos and lineTo
          ctx.stroke();
          ctx.restore();
      }
      
      // Actual simple drawing logic for demo purposes (dot based for ease)
      for (let i = 0; i < symmetry; i++) {
         const angle = (Math.PI * 2 * i) / symmetry;
         const rx = (x - centerX) * Math.cos(angle) - (y - centerY) * Math.sin(angle) + centerX;
         const ry = (x - centerX) * Math.sin(angle) + (y - centerY) * Math.cos(angle) + centerY;
         
         ctx.beginPath();
         ctx.arc(rx, ry, 3, 0, Math.PI * 2);
         ctx.fillStyle = canvasColor;
         ctx.fill();
      }
  };
  const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
  };


  const activeTabClass = theme.isDark 
      ? 'bg-white/10 text-white shadow-sm' 
      : `bg-white shadow-sm text-${theme.accent}-700`;
  
  const activeCategoryClass = theme.isDark
      ? `bg-slate-800 border-slate-700 text-${theme.accent}-400`
      : `bg-${theme.accent}-600 text-white border-${theme.accent}-600 shadow-${theme.accent}-500/30`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-screen">
      <div className="text-center mb-8">
        <h2 className={`font-display text-4xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Bloom Library</h2>
        <p className={`mt-2 font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>Curated resources & interactive tools for your mental growth.</p>
      </div>

      {/* Main Tabs */}
      <div className="flex justify-center mb-10">
        <div className={`p-1 rounded-xl flex gap-1 border ${theme.isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-slate-200'}`}>
           {['resources', 'toolkits', 'articles'].map((tab) => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize
                ${activeTab === tab 
                    ? activeTabClass
                    : (theme.isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-slate-700 hover:bg-white/50')}`}
              >
                {tab}
              </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'resources' ? (
          <motion.div 
            key="resources"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full border transition-all font-bold shadow-sm
                    ${activeCategory === cat 
                      ? activeCategoryClass
                      : (theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : `bg-white/70 border-slate-200 hover:bg-white text-slate-700 hover:text-${theme.accent}-800`)}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeCategory === 'All' ? 'Featured Videos' : `${activeCategory} Videos`}
                </h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${theme.isDark ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-600 bg-white/70 border-slate-200'}`}>
                  {filteredVideos.length} results
                </span>
              </div>
              
              {filteredVideos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode='popLayout'>
                    {filteredVideos.map((vid) => (
                      <GlassCard 
                        key={vid.id} 
                        className={`!p-0 overflow-hidden group cursor-pointer h-full flex flex-col ${theme.isDark ? 'border-white/10' : 'border-white/50'}`} 
                        hoverEffect={true}
                      >
                        <div 
                          className="relative aspect-video bg-slate-900 overflow-hidden"
                          onClick={() => setSelectedVideo(vid)}
                        >
                          <img 
                            src={vid.thumbnailUrl} 
                            alt={vid.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                          />
                          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/50">
                                <Play className="text-white fill-white ml-1" size={24} />
                              </div>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                            <Clock size={10} /> {vid.duration}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <span className={`inline-block text-xs font-extrabold uppercase tracking-wider mb-2 px-2 py-1 rounded-md w-fit ${theme.isDark ? `text-${theme.accent}-300 bg-${theme.accent}-900/50` : `text-${theme.accent}-700 bg-${theme.accent}-100/30`}`}>
                            {vid.category}
                          </span>
                          <h4 className={`font-bold text-lg leading-tight mb-2 transition-colors ${theme.isDark ? `text-slate-100 group-hover:text-${theme.accent}-400` : `text-slate-900 group-hover:text-${theme.accent}-700`}`}>
                            {vid.title}
                          </h4>
                          <p className={`text-sm mt-auto line-clamp-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                            Learn the techniques to manage {vid.category.toLowerCase()} effectively.
                          </p>
                        </div>
                      </GlassCard>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-white/40 rounded-3xl border border-white/50">
                  <p className="text-slate-500 font-medium">No videos found for this category.</p>
                </div>
              )}
            </div>

            {/* Specialists */}
            <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              Verified Specialists <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Online</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => {
                const isFollowed = followedSpecialists.has(doc.id);
                return (
                  <div key={doc.id} onClick={() => setSelectedPsychologist(doc)} className="cursor-pointer">
                    <GlassCard className={`flex items-center gap-5 p-6 relative overflow-hidden h-full ${theme.isDark ? 'border-white/10' : 'border-white/60'}`}>
                        <img src={doc.imageUrl} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md z-10" />
                        <div className="flex-1 z-10">
                            <h4 className={`font-bold text-lg ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{doc.name}</h4>
                            <p className={`text-sm font-bold mb-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-600'}`}>{doc.specialty}</p>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mb-3">
                            <Star size={12} fill="currentColor" /> {doc.rating}
                            </div>
                            <button 
                            onClick={(e) => toggleFollow(doc.id, e)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                                ${isFollowed 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                            >
                            {isFollowed ? (
                                <><UserCheck size={14} /> Connected</>
                            ) : (
                                <><Heart size={14} /> Connect</>
                            )}
                            </button>
                        </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : activeTab === 'articles' ? (
           <motion.div 
             key="articles"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.4 }}
             className="grid md:grid-cols-2 gap-8"
           >
              {articles.map((article) => (
                  <GlassCard key={article.id} className="flex flex-col h-full !p-0 overflow-hidden cursor-pointer group">
                      <div className="h-48 overflow-hidden relative">
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-bold">
                              {article.category}
                          </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                          <h3 className={`text-xl font-bold mb-2 transition-colors ${theme.isDark ? `text-white group-hover:text-${theme.accent}-400` : `text-slate-900 group-hover:text-${theme.accent}-700`}`}>{article.title}</h3>
                          <p className={`mb-4 flex-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>{article.excerpt}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                             <Clock size={12} /> {article.readTime} Read
                             <span className={`ml-auto cursor-pointer ${theme.isDark ? `text-${theme.accent}-400` : `text-${theme.accent}-700`}`}>Read Article &rarr;</span>
                          </div>
                      </div>
                  </GlassCard>
              ))}
           </motion.div>
        ) : (
          <motion.div 
             key="toolkits"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.4 }}
             className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
             {/* Breathing Exercise Card */}
             <GlassCard className={`p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-2xl transition-all ${theme.isDark ? 'border-white/10' : 'border-blue-100'}`}>
                <div className={`mb-6 p-4 rounded-full transition-colors ${theme.isDark ? 'bg-white/10 text-blue-300 group-hover:bg-white/20' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
                  <Wind size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Box Breathing</h3>
                <p className={`mb-6 flex-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>A simple technique to reduce stress and regain focus.</p>
                <Button3D 
                  onClick={() => setActiveToolkit('breathing')}
                  className="w-full"
                >
                  Start Exercise
                </Button3D>
             </GlassCard>

             {/* Grounding Technique Card */}
             <GlassCard className={`p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-2xl transition-all ${theme.isDark ? 'border-white/10' : 'border-emerald-100'}`}>
                <div className={`mb-6 p-4 rounded-full transition-colors ${theme.isDark ? 'bg-white/10 text-emerald-300 group-hover:bg-white/20' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'}`}>
                  <Hand size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>5-4-3-2-1 Grounding</h3>
                <p className={`mb-6 flex-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>Engage your senses to stop anxiety in its tracks.</p>
                <Button3D 
                  onClick={() => setActiveToolkit('grounding')}
                  className="w-full"
                  variant='secondary'
                >
                  Start Grounding
                </Button3D>
             </GlassCard>

             {/* Worry Release Card */}
             <GlassCard className={`p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-2xl transition-all ${theme.isDark ? 'border-white/10' : 'border-pink-100'}`}>
                <div className={`mb-6 p-4 rounded-full transition-colors ${theme.isDark ? 'bg-white/10 text-pink-300 group-hover:bg-white/20' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'}`}>
                  <Cloud size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Worry Release</h3>
                <p className={`mb-6 flex-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>Visualize your worries and let them float away.</p>
                <Button3D 
                  onClick={() => setActiveToolkit('worry')}
                  className="w-full"
                >
                  Open Jar
                </Button3D>
             </GlassCard>

             {/* Zen Canvas Card */}
             <GlassCard className={`p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-2xl transition-all ${theme.isDark ? 'border-white/10' : 'border-purple-100'}`}>
                <div className={`mb-6 p-4 rounded-full transition-colors ${theme.isDark ? 'bg-white/10 text-purple-300 group-hover:bg-white/20' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}`}>
                  <PenTool size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Zen Canvas</h3>
                <p className={`mb-6 flex-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>Draw symmetrical mandalas to find your flow state.</p>
                <Button3D 
                  onClick={() => setActiveToolkit('canvas')}
                  className="w-full"
                  variant='secondary'
                >
                  Create Art
                </Button3D>
             </GlassCard>

             {/* Soundscapes Card */}
             <GlassCard className={`p-8 relative overflow-hidden lg:col-span-2 ${theme.isDark ? 'border-white/10' : 'border-indigo-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-full ${theme.isDark ? 'bg-white/10 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}><Headphones size={24} /></div>
                  <div>
                    <h3 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>Soundscapes</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Real Audio Environments</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {sounds.map((sound) => (
                     <button
                       key={sound.id}
                       onClick={() => handlePlaySound(sound.id, sound.url)}
                       className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                         playingSound === sound.id 
                           ? `bg-${theme.accent}-600 text-white border-${theme.accent}-600 shadow-lg scale-105` 
                           : (theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white/50 border-white/60 hover:bg-white text-slate-800')
                       }`}
                     >
                       <span className="text-3xl mb-1">{sound.icon}</span>
                       <div className="text-center w-full overflow-hidden">
                         <div className="font-bold text-xs truncate mb-1">{sound.label}</div>
                         <div className="text-[10px] opacity-80 font-medium flex justify-center items-center gap-1">
                             {playingSound === sound.id ? <><Volume2 size={8} /> Playing</> : <><Play size={8}/> Play</>}
                         </div>
                       </div>
                     </button>
                   ))}
                </div>
             </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}

      {/* Breathing Modal */}
      <AnimatePresence>
        {activeToolkit === 'breathing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md"
            onClick={() => setActiveToolkit(null)}
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full mx-4 flex flex-col items-center"
            >
              <button 
                onClick={() => setActiveToolkit(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={32}/>
              </button>
              
              <h3 className="text-3xl font-bold text-white mb-12">Box Breathing</h3>
              
              <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                <motion.div 
                  animate={{ 
                      scale: breathingStep === 'Inhale' ? 1.5 : breathingStep === 'Hold' ? 1.5 : 1,
                      opacity: breathingStep === 'Hold' ? 0.9 : 0.6
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className={`absolute inset-0 rounded-full blur-2xl opacity-30`}
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <motion.div 
                  animate={{ 
                    scale: breathingStep === 'Inhale' ? 1.4 : breathingStep === 'Hold' ? 1.4 : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-4 border-4 border-white/20 rounded-full"
                />
                 <motion.div 
                  animate={{ 
                      scale: breathingStep === 'Inhale' ? 1.2 : breathingStep === 'Hold' ? 1.2 : 1 
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className={`relative z-10 w-40 h-40 bg-gradient-to-br ${theme.buttonGradient} text-white rounded-full flex flex-col items-center justify-center shadow-lg`}
                >
                  <motion.span 
                    key={breathingStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold text-2xl"
                  >
                    {breathingStep}
                  </motion.span>
                  <span className="text-xs opacity-80 mt-1 font-mono">4 Seconds</span>
                </motion.div>
              </div>

              <div className="flex gap-2">
                 {['Inhale', 'Hold', 'Exhale'].map((step) => (
                     <div key={step} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${breathingStep === step ? 'bg-white text-slate-900' : 'bg-white/10 text-white/50'}`}>
                         {step}
                     </div>
                 ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grounding 5-4-3-2-1 Modal */}
      <AnimatePresence>
        {activeToolkit === 'grounding' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4"
             onClick={() => setActiveToolkit(null)}
           >
              <motion.div 
                 onClick={(e) => e.stopPropagation()}
                 className="max-w-2xl w-full text-center"
              >
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-3xl font-bold text-white">5-4-3-2-1 Grounding</h3>
                     <button onClick={() => setActiveToolkit(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X /></button>
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-5 gap-2 mb-12">
                     {[
                         { icon: Eye, count: 5, label: "See" },
                         { icon: Hand, count: 4, label: "Touch" },
                         { icon: Ear, count: 3, label: "Hear" },
                         { icon: Wind, count: 2, label: "Smell" },
                         { icon: Coffee, count: 1, label: "Taste" }
                     ].map((item, idx) => (
                         <div key={idx} className={`flex flex-col items-center transition-opacity ${groundingStep === idx ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-lg ${groundingStep === idx ? `bg-${theme.accent}-500 text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]` : 'bg-slate-800 text-slate-400'}`}>
                                 {item.count}
                             </div>
                             <item.icon size={20} className="text-white mb-1" />
                             <span className="text-xs font-bold text-white/70">{item.label}</span>
                         </div>
                     ))}
                  </div>

                  <AnimatePresence mode="wait">
                      <motion.div 
                        key={groundingStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-md"
                      >
                         <h4 className="text-2xl font-bold text-white mb-4">
                             {groundingStep === 0 && "Look around. Find 5 things you can see."}
                             {groundingStep === 1 && "Reach out. Find 4 things you can touch."}
                             {groundingStep === 2 && "Listen close. Find 3 things you can hear."}
                             {groundingStep === 3 && "Breathe deep. Find 2 things you can smell."}
                             {groundingStep === 4 && "Focus inward. Find 1 thing you can taste or feel."}
                             {groundingStep === 5 && "Great job. Take a deep breath."}
                         </h4>
                         
                         {groundingStep < 5 ? (
                             <div className="flex justify-center mt-8">
                                 <Button3D onClick={() => setGroundingStep(prev => prev + 1)}>I found them</Button3D>
                             </div>
                         ) : (
                             <div className="flex justify-center mt-8 gap-4">
                                 <Button3D onClick={() => { setGroundingStep(0); setActiveToolkit(null); }}>Finish</Button3D>
                                 <Button3D variant="secondary" onClick={() => setGroundingStep(0)}>Restart</Button3D>
                             </div>
                         )}
                      </motion.div>
                  </AnimatePresence>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Worry Release Modal */}
      <AnimatePresence>
        {activeToolkit === 'worry' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md overflow-hidden"
             onClick={() => setActiveToolkit(null)}
           >
             <button onClick={() => setActiveToolkit(null)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white z-20"><X size={32}/></button>
             
             <div className="absolute inset-0 z-0" onClick={(e) => e.stopPropagation()}>
                {/* Balloons Area */}
                <div className="w-full h-full relative">
                    <AnimatePresence>
                        {worries.map((w) => (
                            <motion.div
                                key={w.id}
                                initial={{ y: '100vh', opacity: 0 }}
                                animate={{ y: '-20vh', opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 15, ease: "linear" }}
                                style={{ left: `${w.x}%` }}
                                className="absolute cursor-pointer group"
                                onClick={() => popWorry(w.id)}
                            >
                                <div className={`relative w-32 h-40 rounded-[50%] bg-gradient-to-br from-${theme.accent}-300 to-${theme.accent}-500 opacity-80 backdrop-blur-sm flex items-center justify-center p-4 text-center shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/30 hover:brightness-110 transition-all`}>
                                   <span className="text-white font-bold text-xs pointer-events-none select-none">{w.text}</span>
                                   <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[12px] border-t-${theme.accent}-500 border-r-[10px] border-r-transparent" />
                                   <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-0.5 h-10 bg-white/30" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
             </div>

             <motion.div 
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-10 left-0 right-0 px-6 z-10 flex justify-center"
             >
                 <form onSubmit={addWorry} className="w-full max-w-lg relative">
                    <input 
                      type="text" 
                      value={worryInput}
                      onChange={(e) => setWorryInput(e.target.value)}
                      placeholder="Type a worry here..."
                      className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-2xl"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
                        <Wind size={20} />
                    </button>
                    <p className="text-center text-white/50 text-xs mt-4 font-bold">Type your worry and watch it float away. Click balloons to pop them.</p>
                 </form>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Zen Canvas Modal */}
      <AnimatePresence>
         {activeToolkit === 'canvas' && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl"
               onClick={() => setActiveToolkit(null)}
            >
                <div className="w-full max-w-4xl p-4 flex justify-between items-center text-white" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-xl">Zen Canvas</h3>
                        <div className="flex gap-2">
                           {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                               <button 
                                 key={c} 
                                 onClick={() => setCanvasColor(c)}
                                 className={`w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-125 ${canvasColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                                 style={{ backgroundColor: c }}
                               />
                           ))}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={clearCanvas} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-bold">
                            <Trash2 size={16}/> Clear
                        </button>
                        <button onClick={() => setActiveToolkit(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                    </div>
                </div>

                <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white rounded-xl shadow-2xl overflow-hidden cursor-crosshair relative group"
                >
                    <div className="absolute top-4 left-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2 text-sm font-bold">
                        <MousePointer2 size={16} /> Draw to create patterns
                    </div>
                    <canvas 
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="touch-none bg-slate-950"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onMouseMove={draw}
                    />
                </motion.div>
            </motion.div>
         )}
      </AnimatePresence>


      {/* Psychologist Profile Modal */}
      <AnimatePresence>
          {selectedPsychologist && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setSelectedPsychologist(null)}
              >
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`max-w-lg w-full rounded-3xl p-8 relative shadow-2xl ${theme.isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900'}`}
                  >
                      <button onClick={() => setSelectedPsychologist(null)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><X size={20}/></button>
                      
                      <div className="flex flex-col items-center text-center mb-6">
                          <img src={selectedPsychologist.imageUrl} alt={selectedPsychologist.name} className={`w-24 h-24 rounded-full object-cover mb-4 border-4 border-${theme.accent}-100 shadow-lg`} />
                          <h3 className="text-2xl font-bold">{selectedPsychologist.name}</h3>
                          <p className={`text-${theme.accent}-600 font-bold`}>{selectedPsychologist.specialty}</p>
                          <div className="flex items-center gap-1 text-yellow-500 mt-2 font-bold">
                              <Star fill="currentColor" size={16}/> {selectedPsychologist.rating} Rating
                          </div>
                      </div>

                      <div className={`space-y-4 mb-8 ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <p>{selectedPsychologist.bio}</p>
                          <div className="flex flex-wrap gap-2">
                              {selectedPsychologist.languages?.map(l => (
                                  <span key={l} className={`text-xs px-2 py-1 rounded border ${theme.isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>{l}</span>
                              ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold">
                             <Clock size={16} /> Available: {selectedPsychologist.availability}
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <Button3D className="flex-1" onClick={() => alert('Booking feature coming soon!')}>Book Session</Button3D>
                          <Button3D variant="secondary" className="flex-1" onClick={() => setSelectedPsychologist(null)}>Close</Button3D>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Video Modal (Existing) */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                <img 
                  src={selectedVideo.thumbnailUrl} 
                  alt={selectedVideo.title} 
                  className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <Play size={32} className="text-white fill-white ml-2" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="h-1 bg-white/30 rounded-full mb-4 overflow-hidden">
                     <div className={`h-full w-1/3 bg-${theme.accent}-500 rounded-full`} />
                  </div>
                  <div className="flex justify-between text-white text-xs font-bold">
                    <span>03:12 / {selectedVideo.duration}</span>
                  </div>
                </div>
              </div>

              <div className={`p-8 ${theme.isDark ? 'bg-slate-800 text-white' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-bold bg-${theme.accent}-50 text-${theme.accent}-600 px-3 py-1 rounded-full uppercase tracking-wider`}>
                      {selectedVideo.category}
                    </span>
                    <h2 className="text-2xl font-bold mt-3 mb-2 text-slate-900">{selectedVideo.title}</h2>
                    <p className={`font-medium ${theme.isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      In this session, we explore techniques to help you manage {selectedVideo.category.toLowerCase()} and find your inner balance.
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-sm font-bold transition-colors">
                    Save for Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
