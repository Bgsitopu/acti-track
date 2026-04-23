import { Settings, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';
import { CircularProgress } from './components/CircularProgress';
import { WeeklyChart } from './components/WeeklyChart';
import { WeeklyHabitsTable } from './components/WeeklyHabitsTable';
import { ReadingTracker } from './components/ReadingTracker';
import { AddHabitModal } from './components/AddHabitModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { SettingsModal } from './components/SettingsModal';
import { playTerminalPing } from './lib/utils';
import { useState } from 'react';

export default function App() {
  const { habits, toggleProgress, addHabit, deleteHabit, importData, wipeAllData } = useHabits();
  const { theme, setTheme } = useTheme();
  const { username, setUsername, weekStartsOn, setWeekStartsOn, soundEnabled, setSoundEnabled } = useSettings();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  
  const today = new Date();
  const currentWeekDays = eachDayOfInterval({
    start: startOfWeek(today, { weekStartsOn }),
    end: endOfWeek(today, { weekStartsOn })
  }).map(d => format(d, 'yyyy-MM-dd'));

  const handleToggle = (id: string, date: string) => {
    if (soundEnabled) playTerminalPing();
    toggleProgress(id, date);
  };

  // Calculate overview stats
  const dailyHabits = habits.filter(h => h.category === 'Daily Habits');
  
  // Weekly completion
  let totalWeeklyChecked = 0;
  const totalWeeklyPossible = dailyHabits.length * 7;
  dailyHabits.forEach(habit => {
    currentWeekDays.forEach(day => {
      if (habit.progress[day] > 0) totalWeeklyChecked++;
    });
  });
  const weeklyPercent = Math.round((totalWeeklyChecked / totalWeeklyPossible) * 100) || 0;

  // Today completion
  let totalTodayChecked = 0;
  const todayStr = format(today, 'yyyy-MM-dd');
  dailyHabits.forEach(habit => {
     if (habit.progress[todayStr] > 0) totalTodayChecked++;
  });
  const todayPercent = Math.round((totalTodayChecked / dailyHabits.length) * 100) || 0;

  const habitToDeleteObj = habits.find(h => h.id === habitToDelete);

  return (
    <div className="min-h-screen bg-background p-3 md:p-4 font-mono text-sm relative">
      <div className="bento-container w-full max-w-[1200px] mx-auto min-h-[calc(100vh-2rem)] relative z-10">
        
        {/* Top Header Row (Span 4) */}
        <div className="bento-card md:col-span-4 !border-b-[3px] !border-b-primary flex-row justify-between items-center !p-4 !mb-2">
          <div>
            <span className="text-primary font-bold text-lg md:text-xl">ACTI-TRACK V2.0.4</span>
            <span className="ml-4 text-[12px] hidden sm:inline text-text-muted">{username}@Termux:~/$ ./view_dashboard.sh</span>
          </div>
          <div className="text-[12px] text-primary flex items-center gap-4">
            <span className="hidden md:inline">SESSION_UPTIME: 04:22:15 |</span>
            
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              title="Open System Themes Settings"
              className="flex items-center justify-center text-text-muted hover:text-primary transition-colors bg-transparent border-0 p-1 rounded hover:bg-border/50"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              title="Add a new habit entry to track"
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-text-primary px-3 py-1.5 rounded border border-primary/30 transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              <Plus size={14} className="text-primary" /> NEW_ENTRY
            </button>
            <span className="hidden sm:inline">STATUS: <span className="status-dot dot-green ml-2" title="System is currently online"></span><span className="text-text-primary">ONLINE</span></span>
          </div>
        </div>

        {/* Overview Stats Row (Span 1 each) */}
        <div className="bento-card md:col-span-1 md:row-span-2">
          <div className="terminal-header"><span>TODAY_PRG</span><span>[01]</span></div>
          <div className="flex-1 flex flex-col items-center justify-center py-4">
             <CircularProgress
               value={todayPercent}
               size={120}
               strokeWidth={6}
               color="#38bdf8"
               label={`${todayPercent}%`}
             />
             <div className="mt-4 flex flex-col items-center w-full">
               <div className="stat-label">HABITS_COMPLETED</div>
               <div className="stat-value text-xl mt-1">{totalTodayChecked} <span className="text-sm font-normal text-text-muted">/ {dailyHabits.length}</span></div>
               <div className="h-1 bg-border w-full mt-2"><div style={{ width: `${todayPercent}%` }} className="h-full bg-primary" /></div>
             </div>
          </div>
        </div>

        {/* Line Chart Component */}
        <div className="bento-card md:col-span-2 md:row-span-2 min-h-[300px]">
          <div className="terminal-header"><span>WEEKLY_TREND</span><span>[02]</span></div>
          <div className="flex-1 pt-2">
            <WeeklyChart />
          </div>
        </div>

        {/* Productivity / Consistency */}
        <div className="bento-card md:col-span-1">
          <div className="terminal-header"><span>CONSISTENCY</span><span>[03]</span></div>
          <div className="flex-1 flex flex-col justify-center text-center mt-2">
            <div className="stat-value">{weeklyPercent}%</div>
            <div className="stat-label mt-1">THIS_WEEK</div>
            <div className="text-[10px] text-secondary mt-2 border-t border-border pt-2">+12% vs LAST_WEEK</div>
          </div>
        </div>

        <div className="bento-card md:col-span-1">
          <div className="terminal-header"><span>OVERALL_SCORE</span><span>[04]</span></div>
          <div className="flex-1 flex flex-col justify-center text-center mt-2">
            <div className="stat-value text-accent">A-</div>
            <div className="stat-label mt-1">SYSTEM_RATING</div>
          </div>
        </div>

        {/* Table Component */}
        <div className="bento-card md:col-span-2 md:row-span-2">
          <div className="terminal-header"><span>HABIT_MATRIX</span><span>[05]</span></div>
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[600px]">
              <WeeklyHabitsTable 
                habits={habits} 
                onToggle={handleToggle} 
                onDelete={setHabitToDelete} 
                weekStartsOn={weekStartsOn}
              />
            </div>
          </div>
        </div>

        {/* Reading Tracker / Right Panel */}
        <div className="bento-card md:col-span-2 md:row-span-2">
           <div className="terminal-header"><span>FOCUS_MODULE</span><span>[06]</span></div>
           <ReadingTracker habits={habits} onUpdate={handleToggle} />
        </div>

      </div>
      <AddHabitModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addHabit}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentTheme={theme}
        onThemeSelect={setTheme}
        username={username}
        onUsernameChange={setUsername}
        weekStartsOn={weekStartsOn}
        onWeekStartsChange={setWeekStartsOn}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
        habits={habits}
        onImport={importData}
        onWipe={wipeAllData}
      />
      <ConfirmDeleteModal
        isOpen={!!habitToDelete}
        habitName={habitToDeleteObj?.name}
        onConfirm={() => {
          if (habitToDelete) {
            deleteHabit(habitToDelete);
            setHabitToDelete(null);
          }
        }}
        onCancel={() => setHabitToDelete(null)}
      />
    </div>
  );
}
