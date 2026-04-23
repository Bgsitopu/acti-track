import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

export type HabitCategory = 'Daily Habits' | 'Weekly Habits' | 'Monthly Habits' | 'Reading' | 'Other';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  priority: Priority;
  goal: number; // For daily habits it's usually 1. For reading, maybe pages.
  progress: Record<string, number>; // date string "yyyy-MM-dd" -> progress amount
  color: string;
}

const generateMockProgress = (days: number = 30) => {
  const result: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, 'yyyy-MM-dd');
    result[dateStr] = Math.random() > 0.3 ? 1 : 0;
  }
  return result;
};

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Minum Air Setelah Bangun', category: 'Daily Habits', priority: 'High', goal: 1, progress: generateMockProgress(), color: '#8884d8' },
  { id: '2', name: 'Rapikan Tempat Tidur', category: 'Daily Habits', priority: 'Medium', goal: 1, progress: generateMockProgress(), color: '#82ca9d' },
  { id: '3', name: 'Buat Sarapan', category: 'Daily Habits', priority: 'Low', goal: 1, progress: generateMockProgress(), color: '#ffc658' },
  { id: '4', name: 'Olahraga Pagi', category: 'Daily Habits', priority: 'High', goal: 1, progress: generateMockProgress(), color: '#ff8042' },
  { id: '5', name: 'Membaca Buku 10 Hal', category: 'Daily Habits', priority: 'Low', goal: 1, progress: generateMockProgress(), color: '#0088FE' },
  { id: '6', name: 'Nonton Film 2 Jam', category: 'Daily Habits', priority: 'Low', goal: 1, progress: generateMockProgress(), color: '#00C49F' },
  { id: '7', name: 'Makan Siang', category: 'Daily Habits', priority: 'Medium', goal: 1, progress: generateMockProgress(), color: '#FFBB28' },
];

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from API on mount
  useEffect(() => {
    fetch('/api/habits')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setHabits(data.data);
        } else {
          // Fallback to local storage if API is empty
          const saved = localStorage.getItem('habits');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setHabits(parsed);
            } catch (e) {}
          }
        }
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to fetch habits from server, falling back to local:", err);
        const saved = localStorage.getItem('habits');
        if (saved) {
          try {
            setHabits(JSON.parse(saved));
          } catch (e) {}
        }
        setIsLoaded(true);
      });
  }, []);

  // Sync back to API and local storage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem('habits', JSON.stringify(habits));

    fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habits)
    }).catch(err => console.error("Failed to sync habits to server:", err));
  }, [habits, isLoaded]);

  const toggleProgress = (id: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const current = habit.progress[date] || 0;
        return {
          ...habit,
          progress: {
            ...habit.progress,
            [date]: current >= habit.goal ? 0 : habit.goal
          }
        };
      }
      return habit;
    }));
  };

  const updateProgress = (id: string, date: string, value: number) => {
     setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          progress: {
            ...habit.progress,
            [date]: value
          }
        };
      }
      return habit;
    }));
  }

  const addHabit = (habit: Omit<Habit, 'id' | 'progress'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).substr(2, 9),
      progress: {}
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const importData = (importedHabits: Habit[]) => {
    setHabits(importedHabits);
  };

  const wipeAllData = () => {
    setHabits([]);
  };

  return {
    habits,
    toggleProgress,
    updateProgress,
    addHabit,
    deleteHabit,
    importData,
    wipeAllData
  };
}
