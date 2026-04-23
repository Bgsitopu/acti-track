import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HabitCategory, Priority } from '../hooks/useHabits';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string; category: HabitCategory; priority: Priority; goal: number; color: string }) => void;
}

const COLORS = [
  '#38bdf8', // sky-400
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Daily Habits');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [goal, setGoal] = useState<number>(1);
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, priority, goal, color });
    
    // Reset form
    setName('');
    setCategory('Daily Habits');
    setPriority('Medium');
    setGoal(1);
    setColor(COLORS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bento-card w-full max-w-md bg-[#020617] border-primary shadow-[0_0_15px_rgba(56,189,248,0.2)] animate-in fade-in zoom-in duration-200">
        <div className="terminal-header items-center !mb-6">
          <span>SYS.EXEC(NEW_HABIT)</span>
          <button 
            onClick={onClose}
            title="Cancel and close dialog"
            className="text-text-muted hover:text-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="stat-label block mb-2">HABIT_ID (NAME)</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-panel border-b border-border focus:border-primary outline-none px-3 py-2 text-text-primary text-sm font-mono placeholder:text-text-muted/50 transition-colors"
              placeholder="e.g. Morning 5K Run..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="stat-label block mb-2">FREQUENCY</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full bg-panel border-b border-border outline-none px-3 py-2 text-sm text-text-primary font-mono focus:border-primary transition-colors appearance-none"
              >
                <option value="Daily Habits">DAILY</option>
                <option value="Weekly Habits">WEEKLY</option>
                <option value="Monthly Habits">MONTHLY</option>
                <option value="Reading">READING</option>
                <option value="Other">OTHER</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="stat-label block mb-2">PRIORITY_LEVEL</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-panel border-b border-border outline-none px-3 py-2 text-sm text-text-primary font-mono focus:border-primary transition-colors appearance-none"
              >
                <option value="High">HIGH</option>
                <option value="Medium">MEDIUM</option>
                <option value="Low">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Goal */}
            <div>
              <label className="stat-label block mb-2">NUMERIC_TARGET</label>
              <input 
                type="number" 
                min={1}
                required
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full bg-panel border-b border-border focus:border-primary outline-none px-3 py-2 text-text-primary text-sm font-mono transition-colors"
                placeholder="1"
              />
            </div>

            {/* Color */}
            <div>
              <label className="stat-label block mb-2">THEME_COLOR</label>
              <div className="flex gap-2 p-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={`Select theme color ${c}`}
                    className="w-6 h-6 rounded-sm border transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: c, 
                      borderColor: color === c ? '#f1f5f9' : 'transparent',
                      transform: color === c ? 'scale(1.15)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-border mt-6">
            <button 
              type="submit"
              title="Save this new habit"
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-2.5 rounded text-[11px] uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]"
            >
              [ INITIALIZE_ENTRY ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
