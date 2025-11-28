
import { UserData, MoodEntry } from '../types';

const DATA_PREFIX = 'bloom_data_';

export const getUserData = (userId: string): UserData => {
  const data = localStorage.getItem(`${DATA_PREFIX}${userId}`);
  return data ? JSON.parse(data) : { entries: [] };
};

export const saveUserData = (userId: string, data: UserData) => {
  localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(data));
};

export const addEntry = (userId: string, entry: MoodEntry) => {
  const data = getUserData(userId);
  const updatedData = { ...data, entries: [entry, ...data.entries] };
  saveUserData(userId, updatedData);
  return updatedData;
};

export const initializeUser = (userId: string) => {
  if (!localStorage.getItem(`${DATA_PREFIX}${userId}`)) {
    saveUserData(userId, { entries: [] });
  }
};

export const seedDemoData = (userId: string) => {
  // Only seed if empty
  const currentData = getUserData(userId);
  if (currentData.entries.length > 0) return;

  const demoEntries: MoodEntry[] = [];
  const moods = [
    { label: 'Amazing', val: 9 }, 
    { label: 'Good', val: 7 }, 
    { label: 'Okay', val: 5 }, 
    { label: 'Stressed', val: 3 }, 
    { label: 'Amazing', val: 10 }
  ];
  const tags = ['#work', '#family', '#sleep', '#exercise', '#meditation'];

  // Generate last 7 days of data
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    demoEntries.push({
      id: `demo-${i}`,
      date: date.toISOString(),
      mood: randomMood.label,
      moodValue: randomMood.val,
      stressLevel: Math.floor(Math.random() * 5) + 1 + (10 - randomMood.val) / 2, // Correlate stress roughly with mood
      note: "Demo entry generated for preview.",
      tags: [tags[Math.floor(Math.random() * tags.length)]]
    });
  }

  saveUserData(userId, { entries: demoEntries });
};
