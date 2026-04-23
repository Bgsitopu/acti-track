import React from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { Habit } from '../hooks/useHabits';
import { Check, Trash2, Flame } from 'lucide-react';
import { cn, calculateStreak } from '../lib/utils';

interface WeeklyHabitsTableProps {
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onDelete: (id: string) => void;
  weekStartsOn: 0 | 1;
}

export function WeeklyHabitsTable({ habits, onToggle, onDelete, weekStartsOn }: WeeklyHabitsTableProps) {
  const startDate = startOfWeek(new Date(), { weekStartsOn });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  // Show all habits except Reading in the table
  const displayedHabits = habits.filter(h => h.category !== 'Reading');

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-secondary uppercase bg-background/50">
          <tr>
            <th className="px-4 py-3 font-normal text-text-muted border-b border-border">Habit Name</th>
            <th className="px-4 py-3 font-normal text-text-muted text-center border-b border-border">Priority</th>
            <th className="px-4 py-3 font-normal text-text-muted text-center border-b border-border">Streak</th>
            {days.map(day => (
              <th key={format(day, 'yyyy-MM-dd')} className={cn("px-2 py-3 font-normal text-text-muted text-center border-b border-border", isToday(day) && "text-primary font-bold")}>
                <div className="text-[10px] uppercase tracking-widest">{format(day, 'eee')}</div>
                <div className="text-sm mt-1">{format(day, 'dd')}</div>
              </th>
            ))}
            <th className="px-4 py-3 font-normal text-text-muted text-center border-b border-border">Completion</th>
            <th className="px-4 py-3 font-normal text-text-muted text-center border-b border-border">DEL</th>
          </tr>
        </thead>
        <tbody>
          {displayedHabits.map(habit => {
            // Calculate completion for this week
            const completedDays = days.filter(day => habit.progress[format(day, 'yyyy-MM-dd')] > 0).length;
            const completionPercent = Math.round((completedDays / 7) * 100);
            const streakCount = calculateStreak(habit.progress);

            return (
              <tr key={habit.id} className="hover:bg-background/50 transition-colors group">
                <td className="px-4 py-3 text-text-primary border-b border-[#020617]">
                  <div className="flex items-center gap-2">
                    <span className="status-dot flex-shrink-0" style={{ backgroundColor: habit.color, boxShadow: `0 0 8px ${habit.color}` }}></span>
                    <span className="truncate max-w-[120px] sm:max-w-[150px] block" title={habit.name}>{habit.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center border-b border-[#020617]">
                   <span className={cn(
                     "text-[10px] tracking-widest uppercase",
                     habit.priority === 'High' ? 'text-rose-400' :
                     habit.priority === 'Medium' ? 'text-amber-400' :
                     'text-sky-400'
                   )}>
                     [{habit.priority}]
                   </span>
                </td>
                <td className="px-4 py-3 text-center border-b border-[#020617]">
                  <div className="flex items-center justify-center gap-1">
                    <Flame size={14} className={cn("transition-colors", streakCount > 0 ? "text-accent fill-accent" : "text-text-muted opacity-50")} />
                    <span className={cn("text-xs font-bold", streakCount > 0 ? "text-accent" : "text-text-muted")}>{streakCount}</span>
                  </div>
                </td>
                {days.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isChecked = habit.progress[dateStr] > 0;
                  return (
                     <td key={dateStr} className="px-2 py-3 text-center border-b border-[#020617]">
                       <button
                         onClick={() => onToggle(habit.id, dateStr)}
                         title={isChecked ? `Uncheck ${habit.name} for ${format(day, 'MMM dd')}` : `Mark ${habit.name} as done for ${format(day, 'MMM dd')}`}
                         className={cn(
                           "w-5 h-5 rounded-sm flex items-center justify-center mx-auto transition-all",
                           isChecked ? "bg-primary text-background shadow-[0_0_8px_var(--color-primary)]" : "bg-background border border-border group-hover:border-primary/50"
                         )}
                       >
                         {isChecked && <Check size={14} strokeWidth={4} />}
                       </button>
                     </td>
                  );
                })}
                <td className="px-4 py-3 text-center border-b border-[#020617]">
                  <div className="flex items-center justify-center gap-2" title={`This week's completion: ${completionPercent}%`}>
                    <div className="w-full max-w-[60px] bg-background border border-border h-2 overflow-hidden flex">
                      <div className="h-full bg-primary transition-all" style={{ width: `${completionPercent}%`, backgroundColor: habit.color }} />
                    </div>
                    <span className="text-[10px] text-text-muted w-8">{completionPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center border-b border-[#020617]">
                  <button 
                    onClick={() => onDelete(habit.id)}
                    className="text-text-muted hover:text-red-500 transition-colors bg-transparent border-0 p-1 rounded hover:bg-red-500/10"
                    title={`Permanently delete the habit '${habit.name}'`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
