
export interface MoodEntry {
  id: string;
  mood: string; // 'Amazing' | 'Good' | 'Okay' | 'Down' | 'Stressed'
  moodValue: number; // 1-10 scale derived from mood
  stressLevel: number; // 1-10
  note: string;
  date: string; // ISO String
  tags: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xp: number;
}

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  bio?: string;
  availability?: string;
  languages?: string[];
}

export interface VideoResource {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  duration: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate?: string;
  stats?: {
    streak: number;
    entries: number;
    level: number;
  };
  badges?: string[];
}

export interface UserData {
  entries: MoodEntry[];
}

export type Theme = 'calm' | 'ocean' | 'energy' | 'midnight' | 'emerald' | 'forest';

export interface ThemeConfig {
  name: Theme;
  label: string;
  gradient: string;
  accent: string;
  primaryColor: string; // Hex code for JS charts etc
  orbColors: string[];
  buttonGradient: string;
  textColor: string;
  glassColor: string;
  isDark: boolean;
}
