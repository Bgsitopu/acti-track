import React from 'react';
import { Habit } from '../hooks/useHabits';
import { format } from 'date-fns';
import { CircularProgress } from './CircularProgress';
import { calculateStreak } from '../lib/utils';

interface ReadingTrackerProps {
  habits: Habit[];
  onUpdate: (id: string, date: string, value: number) => void;
}

export function ReadingTracker({ habits, onUpdate }: ReadingTrackerProps) {
  const readingHabits = habits.filter(h => h.category === 'Reading');
  const today = format(new Date(), 'yyyy-MM-dd');

  // If no reading habits exist, show a placeholder or mock one
  const mockReadingHabit = readingHabits.length > 0 ? readingHabits[0] : {
    id: 'reading-1',
    name: 'The Psychology of Money',
    goal: 50,
    progress: { [today]: 24 },
    color: '#0ea5e9'
  };

  const currentProgress = mockReadingHabit.progress[today] || 0;
  const readingStreak = calculateStreak(mockReadingHabit.progress);

  return (
    <div className="flex flex-col h-full gap-6 pb-2">
      <div className="flex flex-col items-center justify-center py-6 bg-background rounded border border-border">
        <CircularProgress
           value={currentProgress}
           max={mockReadingHabit.goal}
           size={160}
           strokeWidth={12}
           color={mockReadingHabit.color}
           label={`${Math.round((currentProgress / mockReadingHabit.goal) * 100)}%`}
           className="mb-2"
        />
        <h3 className="mt-4 font-bold text-lg text-center text-text-primary uppercase">{mockReadingHabit.name}</h3>
        <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">
          DAILY_GOAL: {currentProgress}/{mockReadingHabit.goal} PG
          <span className="text-accent ml-2 font-bold tracking-normal inline-flex items-center gap-1">
             <span className="text-xl leading-none">🔥</span> {readingStreak} DAYS
          </span>
         </p>
      </div>

      <div className="flex-1">
        <h4 className="text-[11px] text-primary uppercase mb-3 border-b border-border pb-1">RECENT_LOGS</h4>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const date = new Date(new Date().setDate(new Date().getDate() - i));
            const dateStr = format(date, 'yyyy-MM-dd');
            const pages = i === 0 ? currentProgress : Math.floor(Math.random() * 30) + 10;
            return (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#020617] text-sm hover:text-primary transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-[11px]">[{format(date, 'MM-dd')}]</span>
                  <span className="text-[#cbd5e1]">READING_SESSION</span>
                </div>
                <div className="text-xs text-secondary flex items-center">
                  <span className="status-dot dot-green"></span>
                  +{pages} PG
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
