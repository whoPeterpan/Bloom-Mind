
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind, CheckCircle, Smile } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const activities = [
    { text: "Sarah from London just checked in", icon: Smile, color: "text-yellow-500" },
    { text: "Mike completed a breathing exercise", icon: Wind, color: "text-blue-500" },
    { text: "Alex unlocked the 'Early Bird' badge", icon: CheckCircle, color: "text-green-500" },
    { text: "Jamie is feeling 'Grateful' today", icon: Heart, color: "text-pink-500" },
    { text: "Someone just joined from New York", icon: Smile, color: "text-purple-500" },
];

export const CommunityPulse = () => {
    const [index, setIndex] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % activities.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const ActivityIcon = activities[index].icon;

    return (
        <div className="fixed bottom-8 right-6 z-30 hidden md:flex flex-col gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider pl-1 text-right ${theme.name === 'midnight' ? 'text-slate-500' : 'text-slate-400'}`}>
                Live Community
            </span>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md border shadow-lg ${theme.name === 'midnight' ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white/80 border-white/60 text-slate-700'}`}
                >
                    <div className={`p-1.5 rounded-full bg-white/10 ${activities[index].color}`}>
                        <ActivityIcon size={16} />
                    </div>
                    <span className="text-sm font-bold pr-2">{activities[index].text}</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
