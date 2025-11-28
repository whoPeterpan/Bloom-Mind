
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button3D } from '../components/ui/GlassComponents';
import { Calendar, Save, Tag, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { addEntry } from '../utils/storage';
import { MoodEntry } from '../types';

interface MoodEmojiProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  accentColor: string;
}

const MoodEmoji: React.FC<MoodEmojiProps> = ({ emoji, label, isSelected, onClick, accentColor }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
      isSelected 
        ? `bg-white/80 shadow-lg scale-105 border-2 border-${accentColor}-400` 
        : 'bg-white/40 hover:bg-white/60 border border-transparent'
    }`}
  >
    <span className="text-4xl drop-shadow-sm">{emoji}</span>
    <span className={`text-xs font-bold ${isSelected ? `text-${accentColor}-800` : 'text-slate-600'}`}>{label}</span>
  </motion.button>
);

export const Journal = () => {
  const [selectedMood, setSelectedMood] = useState<{label: string, val: number} | null>(null);
  const [stressLevel, setStressLevel] = useState(5); // Renamed from intensity
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const moods = [
    { emoji: '🤩', label: 'Amazing', val: 10 },
    { emoji: '🙂', label: 'Good', val: 8 },
    { emoji: '😐', label: 'Okay', val: 6 },
    { emoji: '😔', label: 'Down', val: 4 },
    { emoji: '😫', label: 'Stressed', val: 2 },
  ];

  const handleSave = () => {
    const userStr = localStorage.getItem('bloom_user');
    if (!userStr) {
        setError('Please sign in to save entries.');
        return;
    }
    if (!selectedMood) {
        setError('Please select a mood.');
        return;
    }

    const user = JSON.parse(userStr);
    
    const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood.label,
        moodValue: selectedMood.val,
        stressLevel: stressLevel,
        note: note,
        tags: ['#daily'] // Simplified tags for now
    };

    addEntry(user.id, newEntry);
    
    setSaved(true);
    setError('');
    // Reset form
    setTimeout(() => {
        setSaved(false);
        setNote('');
        setSelectedMood(null);
        setStressLevel(5);
    }, 2000);
  };

  const accentText = theme.name === 'midnight' ? 'text-indigo-400' : `text-${theme.accent}-700`;
  const tagBg = theme.name === 'midnight' ? 'bg-slate-700 text-indigo-300' : `bg-${theme.accent}-50 text-${theme.accent}-700 border-${theme.accent}-100`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h2 className={`font-display text-4xl font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>Mood Reflection</h2>
        <p className={`mt-2 font-medium ${theme.name === 'midnight' ? 'text-slate-300' : 'text-slate-700'}`}>Check in with yourself. How are you really feeling?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Col: Input */}
        <div className="space-y-6">
           <GlassCard>
             <h3 className={`text-lg font-bold mb-4 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>Select your mood</h3>
             <div className="grid grid-cols-5 gap-2">
               {moods.map((m) => (
                 <MoodEmoji 
                   key={m.label} 
                   emoji={m.emoji} 
                   label={m.label} 
                   isSelected={selectedMood?.label === m.label}
                   onClick={() => setSelectedMood({label: m.label, val: m.val})}
                   accentColor={theme.accent}
                 />
               ))}
             </div>
           </GlassCard>

           <GlassCard>
             <div className="flex justify-between mb-2">
                <h3 className={`text-lg font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>Stress Level</h3>
                <span className={`font-mono font-bold ${accentText}`}>{stressLevel}/10</span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={stressLevel} 
               onChange={(e) => setStressLevel(parseInt(e.target.value))}
               className={`w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-${theme.accent}-600`}
             />
             <div className={`flex justify-between text-xs font-semibold mt-2 ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-600'}`}>
               <span>Low</span>
               <span>High</span>
             </div>
           </GlassCard>

           <GlassCard>
             <h3 className={`text-lg font-bold mb-4 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>Add a note</h3>
             <textarea 
               value={note}
               onChange={(e) => setNote(e.target.value)}
               className={`w-full h-32 bg-white/60 border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-${theme.accent}-400 focus:outline-none resize-none placeholder-slate-600 text-slate-800 font-medium`}
               placeholder="What's on your mind today?"
             />
             <div className="mt-4 flex gap-2">
               {['#work', '#family', '#health', '#sleep'].map(tag => (
                 <button key={tag} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold hover:brightness-95 transition-colors border border-transparent ${tagBg}`}>
                   <Tag size={12}/> {tag}
                 </button>
               ))}
             </div>
           </GlassCard>

           {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}

           <Button3D onClick={handleSave} className="w-full py-4 text-lg">
             {saved ? 'Saved Successfully! ✨' : 'Save Entry'}
           </Button3D>
        </div>

        {/* Right Col: Preview & Affirmation */}
        <div className="space-y-6">
          <GlassCard className={`border-white/70 ${theme.name === 'midnight' ? 'bg-indigo-900/30' : `bg-gradient-to-br from-${theme.accent}-100/50 to-pink-100/50`}`}>
             <div className={`flex items-center gap-2 mb-4 font-bold ${theme.name === 'midnight' ? 'text-indigo-300' : `text-${theme.accent}-800`}`}>
               <Sparkles size={20} />
               <h3>Daily Affirmation</h3>
             </div>
             <p className={`font-display text-2xl font-medium leading-snug ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>
               "I am worthy of peace, I am capable of growth, and I am allowed to take things one step at a time."
             </p>
             <div className="mt-6 flex justify-end">
               <button className={`text-sm font-bold underline ${theme.name === 'midnight' ? 'text-slate-400 hover:text-white' : `text-slate-600 hover:text-${theme.accent}-700`}`}>Get another</button>
             </div>
          </GlassCard>

          <GlassCard>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
              <Calendar size={18} /> Daily Check
            </h3>
            <div className="flex items-center justify-center h-32 text-center">
                <p className={`text-sm ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Visit the <strong>Dashboard</strong> to see your full weekly analytics and mood trends.
                </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
