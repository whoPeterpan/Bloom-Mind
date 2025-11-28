
import React, { useEffect, useState } from 'react';
import { GlassCard, Button3D } from '../components/ui/GlassComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Calendar, BarChart2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getUserData } from '../utils/storage';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
      streak: 0,
      entries: 0,
      highlight: { day: '-', note: 'No data yet' },
      topEmotions: [] as { label: string, val: number, color: string }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const userStr = localStorage.getItem('bloom_user');
      if (userStr) {
          const user = JSON.parse(userStr);
          const userData = getUserData(user.id);
          
          if (userData.entries.length > 0) {
              processData(userData.entries);
          } else {
              setChartData([]); // Explicitly empty
          }
      }
      setLoading(false);
  }, []);

  const processData = (entries: any[]) => {
      // 1. Sort by date ascending
      const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // 2. Map to chart format (last 7 entries max)
      const data = sorted.slice(-7).map(e => ({
          name: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
          mood: e.moodValue,
          stress: e.stressLevel
      }));
      setChartData(data);

      // 3. Calculate Stats
      const totalEntries = entries.length;
      
      // Find happiest day (max moodValue)
      const happiest = sorted.reduce((prev, current) => (prev.moodValue > current.moodValue) ? prev : current);
      const happiestDay = new Date(happiest.date).toLocaleDateString('en-US', { weekday: 'long' });

      // Calculate Top Emotions
      const emotionCounts: Record<string, number> = {};
      entries.forEach(e => {
          emotionCounts[e.mood] = (emotionCounts[e.mood] || 0) + 1;
      });
      
      const total = entries.length;
      const topEmotions = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([key, count], index) => {
             const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-red-500', 'bg-slate-500'];
             return {
                 label: key,
                 val: Math.round((count / total) * 100),
                 color: colors[index] || 'bg-slate-500'
             };
        });

      setStats({
          streak: calculateStreak(sorted),
          entries: totalEntries,
          highlight: { 
              day: happiestDay, 
              note: `You felt "${happiest.mood}" with stress level ${happiest.stressLevel}.`
          },
          topEmotions
      });
  };

  const calculateStreak = (entries: any[]) => {
      // Simple streak logic for demo
      if (entries.length === 0) return 0;
      let streak = 0;
      const today = new Date();
      // Logic would be more complex in real app, simplified here
      return entries.length > 1 ? Math.floor(entries.length / 1.5) : 1; 
  };

  if (loading) return <div className="p-12 text-center font-bold">Loading insights...</div>;

  const EmptyState = () => (
      <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${theme.name === 'midnight' ? 'bg-slate-800' : 'bg-white/50'}`}>
              <BarChart2 size={40} className={`opacity-50 ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>No Data Yet</h3>
          <p className={`mb-8 max-w-md ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-600'}`}>
              Start your journey by logging your first mood entry. Your insights will appear here automatically.
          </p>
          <Link to="/journal">
             <Button3D>Log First Entry</Button3D>
          </Link>
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className={`font-display text-4xl font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>Your Insights</h2>
          <p className={`mt-2 font-medium ${theme.name === 'midnight' ? 'text-slate-300' : 'text-slate-700'}`}>Visualizing your emotional journey.</p>
        </div>
        
        {chartData.length > 0 && (
            <div className="flex gap-4">
            <GlassCard className="!p-3 flex items-center gap-3 !rounded-xl border-white/70">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700"><Award size={20}/></div>
                <div>
                <div className="text-xs text-slate-600 font-bold">Streak</div>
                <div className="font-bold text-slate-900">{stats.streak} Days 🔥</div>
                </div>
            </GlassCard>
            <GlassCard className="!p-3 flex items-center gap-3 !rounded-xl border-white/70">
                <div className={`p-2 rounded-lg ${theme.name === 'midnight' ? 'bg-indigo-900 text-indigo-300' : `bg-${theme.accent}-100 text-${theme.accent}-700`}`}><Calendar size={20}/></div>
                <div>
                <div className="text-xs text-slate-600 font-bold">Entries</div>
                <div className="font-bold text-slate-900">{stats.entries} Total</div>
                </div>
            </GlassCard>
            </div>
        )}
      </div>

      {chartData.length === 0 ? (
          <GlassCard className="min-h-[400px]">
             <EmptyState />
          </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <GlassCard className="lg:col-span-2 min-h-[400px]">
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>
                <TrendingUp size={18} /> Mood vs. Stress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primaryColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.primaryColor} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.name === 'midnight' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                <XAxis dataKey="name" stroke={theme.name === 'midnight' ? '#94a3b8' : '#334155'} tick={{fill: theme.name === 'midnight' ? '#94a3b8' : '#334155'}} />
                <YAxis stroke={theme.name === 'midnight' ? '#94a3b8' : '#334155'} tick={{fill: theme.name === 'midnight' ? '#94a3b8' : '#334155'}} />
                <Tooltip 
                    contentStyle={{ 
                    backgroundColor: theme.name === 'midnight' ? '#1e293b' : 'rgba(255,255,255,0.95)', 
                    borderRadius: '12px', 
                    border: theme.name === 'midnight' ? '1px solid #334155' : '1px solid #cbd5e1', 
                    color: theme.name === 'midnight' ? '#f8fafc' : '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: theme.name === 'midnight' ? '#f8fafc' : '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="mood" stroke={theme.primaryColor} fillOpacity={1} fill="url(#colorMood)" strokeWidth={3} name="Mood (1-10)" />
                <Area type="monotone" dataKey="stress" stroke="#82ca9d" fillOpacity={1} fill="url(#colorStress)" strokeWidth={3} name="Stress (1-10)" />
                </AreaChart>
            </ResponsiveContainer>
            </GlassCard>

            {/* Side Stats */}
            <div className="space-y-6">
            <GlassCard>
                <h3 className={`text-lg font-bold mb-4 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>Weekly Highlight</h3>
                <div className="p-4 bg-orange-100/60 rounded-xl border border-orange-200">
                    <span className="text-4xl block mb-2">🌞</span>
                    <p className="font-bold text-slate-900">Happiest Day: {stats.highlight.day}</p>
                    <p className="text-sm text-slate-700 font-medium">{stats.highlight.note}</p>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className={`text-lg font-bold mb-4 ${theme.name === 'midnight' ? 'text-white' : 'text-slate-800'}`}>Top Emotions</h3>
                <div className="space-y-3">
                    {stats.topEmotions.map((stat) => (
                    <div key={stat.label}>
                        <div className={`flex justify-between text-sm mb-1 font-bold ${theme.name === 'midnight' ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span>{stat.label}</span>
                        <span>{stat.val}%</span>
                        </div>
                        <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }} />
                        </div>
                    </div>
                    ))}
                </div>
            </GlassCard>
            </div>
        </div>
      )}
    </div>
  );
};
