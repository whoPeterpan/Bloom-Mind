
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../components/ui/GlassComponents';
import { Award, Settings, Zap, Calendar, Edit2, Shield, Bell, X, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  
  // Predefined "3D-style" / Character avatars
  const characterAvatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Liam",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Midnight",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Vibe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
  ];

  useEffect(() => {
    const stored = localStorage.getItem('bloom_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Enriched mock data
      setUser({
        ...parsed,
        joinDate: 'Sept 2024',
        stats: { streak: 12, entries: 48, level: 5 },
        badges: ['Early Bird', 'Mindful Master', 'Consistent Logger']
      });
    }
  }, []);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    localStorage.setItem('bloom_user', JSON.stringify(updatedUser));
    // Dispatch event to update Navbar
    window.dispatchEvent(new Event('auth-change'));
    setShowAvatarModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAvatarUpdate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`animate-pulse font-bold text-${theme.accent}-600`}>Loading Profile...</div>
    </div>
  );

  const accentText = theme.name === 'midnight' ? 'text-indigo-400' : `text-${theme.accent}-700`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative">
      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        
        {/* Left Column: ID Card */}
        <div className="space-y-6">
          <GlassCard className="text-center p-8 border-white/60 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-b from-${theme.accent}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
            
            <div className="relative inline-block mb-4 group/avatar">
               <div className={`w-32 h-32 rounded-full p-1 mx-auto shadow-lg bg-gradient-to-tr ${theme.buttonGradient}`}>
                 <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                 </div>
               </div>
               <button 
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-1 right-1 bg-slate-900 text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-lg z-10 border-2 border-white"
                title="Change Avatar"
               >
                 <Edit2 size={16} />
               </button>
            </div>
            
            <h2 className={`text-2xl font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
            <p className="text-slate-500 font-medium text-sm mb-6">{user.email}</p>
            
            <div className="flex justify-center gap-4 text-center">
              <div>
                <div className={`text-xl font-bold ${accentText}`}>{user.stats.level}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Level</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <div className={`text-xl font-bold ${accentText}`}>{user.stats.streak}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Streak</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>
              <Settings size={18} /> Settings
            </h3>
            <div className="space-y-3">
              <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${theme.name === 'midnight' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-white/50'}`}>
                <span className="flex items-center gap-2"><Bell size={16}/> Notifications</span>
                <div className="w-8 h-4 bg-green-500 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" /></div>
              </button>
              <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors font-medium text-sm ${theme.name === 'midnight' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-white/50'}`}>
                <span className="flex items-center gap-2"><Shield size={16}/> Privacy</span>
                <span className="text-xs text-slate-400">Standard</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Stats & Badges */}
        <div className="space-y-8">
           <GlassCard className="p-8">
             <div className="flex justify-between items-center mb-6">
               <h3 className={`text-2xl font-bold flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>
                 <Award className="text-yellow-500" /> Achievements
               </h3>
               <span className={`text-sm font-bold px-3 py-1 rounded-full ${theme.name === 'midnight' ? 'text-indigo-300 bg-indigo-900/50' : `text-${theme.accent}-700 bg-${theme.accent}-50`}`}>{user.badges.length} Unlocked</span>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {user.badges.map((badge: string, i: number) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center gap-2 ${theme.name === 'midnight' ? 'bg-slate-800 border-slate-700' : 'bg-white/50 border-white/60'}`}
                 >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-100 flex items-center justify-center text-2xl shadow-sm">
                      🏆
                    </div>
                    <span className={`font-bold text-sm ${theme.name === 'midnight' ? 'text-slate-200' : 'text-slate-800'}`}>{badge}</span>
                 </motion.div>
               ))}
               <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center gap-2 opacity-60 ${theme.name === 'midnight' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200/50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${theme.name === 'midnight' ? 'bg-slate-700' : 'bg-slate-200'}`}>🔒</div>
                  <span className="font-bold text-slate-500 text-sm">Locked</span>
               </div>
             </div>
           </GlassCard>

           <div className="grid md:grid-cols-2 gap-6">
             <GlassCard className={`border-white/60 ${theme.name === 'midnight' ? 'bg-slate-800/60' : 'bg-gradient-to-br from-indigo-50 to-blue-50'}`}>
                <h4 className={`font-bold mb-2 flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}><Zap size={18} className="text-blue-500"/> Energy Level</h4>
                <p className={`text-sm mb-4 ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-600'}`}>Your average energy has increased by 15% this week.</p>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5 }} className="h-full bg-blue-500 rounded-full" />
                </div>
             </GlassCard>

             <GlassCard className={`border-white/60 ${theme.name === 'midnight' ? 'bg-slate-800/60' : 'bg-gradient-to-br from-pink-50 to-rose-50'}`}>
                <h4 className={`font-bold mb-2 flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}><Calendar size={18} className="text-pink-500"/> Consistency</h4>
                <p className={`text-sm mb-4 ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-600'}`}>You've logged in for 5 consecutive days!</p>
                <div className="flex gap-1">
                   {[1,1,1,1,1,0,0].map((active, idx) => (
                     <div key={idx} className={`h-8 flex-1 rounded-md ${active ? 'bg-pink-400' : 'bg-pink-100'}`} />
                   ))}
                </div>
             </GlassCard>
           </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] ${theme.name === 'midnight' ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}
            >
              <div className={`p-6 border-b flex justify-between items-center z-10 ${theme.name === 'midnight' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                 <h3 className={`text-xl font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>Choose Your Look</h3>
                 <button onClick={() => setShowAvatarModal(false)} className={`p-2 rounded-full ${theme.name === 'midnight' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
                    <X size={20} />
                 </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-8">
                {/* Section 1: 3D Characters */}
                <div>
                   <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Award size={14}/> 3D Characters
                   </h4>
                   <div className="grid grid-cols-4 gap-4">
                     {characterAvatars.map((url, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleAvatarUpdate(url)}
                         className={`aspect-square rounded-2xl transition-all flex items-center justify-center p-1 relative group overflow-hidden border ${theme.name === 'midnight' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-500' : `bg-slate-50 border-slate-200 hover:bg-${theme.accent}-50 hover:border-${theme.accent}-300`}`}
                       >
                         <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform" />
                         {user.avatar === url && (
                            <div className={`absolute inset-0 flex items-center justify-center bg-${theme.accent}-500/20`}>
                              <div className={`text-white p-1 rounded-full bg-${theme.accent}-600`}><Check size={16}/></div>
                            </div>
                         )}
                       </button>
                     ))}
                   </div>
                </div>

                {/* Section 2: Upload Custom */}
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <ImageIcon size={14}/> Upload Your Own
                   </h4>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group ${theme.name === 'midnight' ? 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800' : `border-slate-300 hover:border-${theme.accent}-400 hover:bg-${theme.accent}-50`}`}
                  >
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${theme.name === 'midnight' ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-indigo-400' : `bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-${theme.accent}-500`}`}>
                        <Upload size={24} />
                     </div>
                     <p className={`font-bold ${theme.name === 'midnight' ? 'text-slate-300' : 'text-slate-700'}`}>Click to upload image</p>
                     <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={handleFileUpload}
                     />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
