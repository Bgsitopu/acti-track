import React, { useRef } from 'react';
import { X, Settings2, Download, Upload, Trash2, Volume2, VolumeX, UserSquare2 } from 'lucide-react';
import { ThemeName, THEMES } from '../hooks/useTheme';
import { Habit } from '../hooks/useHabits';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Theme props
  currentTheme: ThemeName;
  onThemeSelect: (theme: ThemeName) => void;
  // User settings props
  username: string;
  onUsernameChange: (name: string) => void;
  weekStartsOn: 0 | 1;
  onWeekStartsChange: (val: 0 | 1) => void;
  soundEnabled: boolean;
  onSoundToggle: (val: boolean) => void;
  // Data props
  habits: Habit[];
  onImport: (data: Habit[]) => void;
  onWipe: () => void;
}

export function SettingsModal({ 
  isOpen, onClose, currentTheme, onThemeSelect, 
  username, onUsernameChange, weekStartsOn, onWeekStartsChange,
  soundEnabled, onSoundToggle, habits, onImport, onWipe
}: SettingsModalProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(habits, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acti-track-backup-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImport(data);
          alert("SYS.MSG: Data successfully imported!");
        } else {
          alert("SYS.ERR: Invalid data format. Expected an array of habits.");
        }
      } catch (err) {
        alert("SYS.ERR: Failed to parse JSON file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleWipe = () => {
    if (window.confirm("SYS.WARN: DANGER ZONE\n\nAre you absolutely sure you want to permanently delete ALL habit data and progress? This action cannot be reversed.")) {
      if (window.confirm("SYS.WARN: CONFIRM PROCEED FORMATTING SYSTEM DATA?")) {
        onWipe();
        alert("SYS.MSG: Data wiped successfully.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bento-card w-full max-w-md bg-[#020617] border-primary shadow-[0_0_15px_rgba(56,189,248,0.2)] animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        <div className="terminal-header items-center !mb-2 shrink-0">
          <span className="flex items-center gap-2"><Settings2 size={14} /> SYS.CONFIG(ALL)</span>
          <button onClick={onClose} title="Close settings wrapper" className="text-text-muted hover:text-accent transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="py-2 space-y-6 overflow-y-auto px-1 pr-2 flex-1">
          
          {/* Identity Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-text-muted uppercase tracking-widest border-b border-border pb-1">
              <UserSquare2 size={12} /> Terminal Identity
            </div>
            <div>
              <label className="text-[10px] text-text-muted block mb-1">USERNAME_ALIAS</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                maxLength={20}
                className="w-full bg-panel border border-border focus:border-primary outline-none px-3 py-1.5 text-text-primary text-sm font-mono transition-colors rounded"
                placeholder="Enter username"
              />
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-text-muted uppercase tracking-widest border-b border-border pb-1">
              <Settings2 size={12} /> System Preferences
            </div>
            
            <div className="flex items-center justify-between">
               <div>
                  <div className="text-sm text-text-primary">SFX Module</div>
                  <div className="text-[10px] text-text-muted">Play sound on habit completion</div>
               </div>
               <button 
                 onClick={() => onSoundToggle(!soundEnabled)}
                 className={`p-2 rounded border transition-colors ${soundEnabled ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-border text-text-muted hover:text-text-primary'}`}
               >
                 {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
               </button>
            </div>

            <div className="flex items-center justify-between">
               <div>
                  <div className="text-sm text-text-primary">Calendar Standard</div>
                  <div className="text-[10px] text-text-muted">First day of the week</div>
               </div>
               <select 
                 value={weekStartsOn}
                 onChange={(e) => onWeekStartsChange(Number(e.target.value) as 0 | 1)}
                 className="bg-panel border border-border outline-none px-2 py-1 text-xs text-text-primary font-mono focus:border-primary transition-colors appearance-none rounded"
               >
                 <option value={1}>Monday</option>
                 <option value={0}>Sunday</option>
               </select>
            </div>
          </section>

          {/* Theme Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-text-muted uppercase tracking-widest border-b border-border pb-1">
              <Settings2 size={12} /> Visual System Profile
            </div>
            <div className="flex flex-col gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeSelect(t.id)}
                  title={`Apply ${t.name} visual theme`}
                  className={`flex items-center justify-between p-2.5 border rounded transition-all ${
                    currentTheme === t.id 
                      ? 'bg-primary/10 border-primary text-primary shadow-[0_0_8px_var(--color-primary)]' 
                      : 'bg-background border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.displayColor, boxShadow: `0 0 6px ${t.displayColor}` }} />
                    <span className="font-bold text-[12px] tracking-widest uppercase">{t.name}</span>
                  </div>
                  {currentTheme === t.id && <span className="text-[10px] uppercase font-bold">[ ACTIVE ]</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Persistence Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-text-muted uppercase tracking-widest border-b border-border pb-1">
              <Download size={12} /> Data Management
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 bg-background hover:bg-border/50 text-text-primary border border-border py-2 rounded text-[11px] uppercase tracking-widest transition-all"
              >
                <Download size={14} /> Export JSON
              </button>
              <button 
                onClick={handleImportClick}
                className="flex-1 flex items-center justify-center gap-2 bg-background hover:bg-border/50 text-text-primary border border-border py-2 rounded text-[11px] uppercase tracking-widest transition-all"
              >
                <Upload size={14} /> Import JSON
              </button>
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          </section>

          {/* Danger Zone */}
          <section className="space-y-3 mt-4 pt-4 border-t border-red-900/30">
            <div className="flex items-center gap-2 text-[11px] text-red-500 uppercase tracking-widest">
              <Trash2 size={12} /> Danger Zone
            </div>
            <button 
                onClick={handleWipe}
                className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-900/50 text-red-500 border border-red-900/50 py-2.5 rounded text-[11px] uppercase tracking-widest font-bold transition-all"
              >
                [ FORMAT_SYSTEM_DATA ]
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
