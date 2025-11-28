
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassComponents';
import { generateEmpathyResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useTheme } from '../context/ThemeContext';

export const EmpathyBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello there! I'm EmpathyBot. I'm here to listen without judgment. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await generateEmpathyResponse(history, userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const userBubbleClass = `bg-${theme.accent}-600 text-white rounded-tr-none`;
  const botBubbleClass = theme.name === 'midnight' 
      ? 'bg-slate-800/80 text-slate-100 border border-slate-700 rounded-tl-none' 
      : 'bg-white/80 backdrop-blur-sm text-slate-900 border border-white/60 rounded-tl-none';

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-[1fr_300px] gap-8">
        
        {/* Main Chat Area */}
        <GlassCard className="h-[70vh] flex flex-col p-0 overflow-hidden relative border-white/60">
          {/* Header */}
          <div className={`p-4 flex items-center justify-between backdrop-blur-md border-b ${theme.name === 'midnight' ? 'bg-slate-900/40 border-slate-700' : 'bg-white/40 border-white/30'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-tr ${theme.buttonGradient}`}>
                <Bot size={20} />
              </div>
              <div>
                <h3 className={`font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>EmpathyBot</h3>
                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online & Listening
                </p>
              </div>
            </div>
            <Sparkles className="text-yellow-500 opacity-60" size={20} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative font-medium ${
                  msg.role === 'user' 
                    ? userBubbleClass
                    : botBubbleClass
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] absolute bottom-1 ${msg.role === 'user' ? 'left-4 text-white/70' : 'right-4 text-slate-500 font-bold'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                 <div className={`rounded-2xl p-4 rounded-tl-none flex gap-1 items-center border ${theme.name === 'midnight' ? 'bg-slate-800/80 border-slate-700' : 'bg-white/70 border-white/50'}`}>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                 </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className={`p-4 backdrop-blur-md border-t ${theme.name === 'midnight' ? 'bg-slate-900/40 border-slate-700' : 'bg-white/40 border-white/30'}`}>
            <div className="relative flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your feelings here..."
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 shadow-inner font-medium ${theme.name === 'midnight' ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500 focus:ring-indigo-500' : `bg-white/60 border-white/50 text-slate-800 placeholder-slate-500 focus:ring-${theme.accent}-400`}`}
              />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                type="submit"
                className={`p-3 rounded-xl shadow-lg transition-colors disabled:opacity-50 text-white bg-${theme.accent}-600 hover:bg-${theme.accent}-700`}
                disabled={!input.trim() || isTyping}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </form>
        </GlassCard>

        {/* Sidebar Info - Hidden on small mobile */}
        <div className="hidden md:flex flex-col gap-6">
          <GlassCard className="p-6 text-center border-white/60">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${theme.name === 'midnight' ? 'bg-indigo-900 text-indigo-300' : `bg-${theme.accent}-100 text-${theme.accent}-600`}`}>
               🧠
            </div>
            <h3 className={`font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>Mindful Tip</h3>
            <p className={`text-sm mt-2 font-medium ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-700'}`}>
              "Feelings are like clouds. They float by, changing shape. You are the sky—vast and unchanging."
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/60">
            <h4 className={`font-bold mb-3 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>Suggested Topics</h4>
            <div className="flex flex-wrap gap-2">
              {["Anxiety", "Work Stress", "Sleep", "Gratitude", "Loneliness"].map(topic => (
                <button 
                  key={topic} 
                  onClick={() => setInput(`I want to talk about ${topic.toLowerCase()}`)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all font-semibold ${theme.name === 'midnight' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white/50 border-white/60 hover:bg-white/90 text-slate-800'}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
