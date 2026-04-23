import { useState, useEffect } from 'react';

export function useSettings() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('acti-username') || 'User';
  });
  
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(() => {
    const saved = localStorage.getItem('acti-week-starts');
    return saved === '0' ? 0 : 1; // Default to Monday (1)
  });
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('acti-sound');
    return saved ? saved === 'true' : true; // Default to true
  });

  useEffect(() => localStorage.setItem('acti-username', username), [username]);
  useEffect(() => localStorage.setItem('acti-week-starts', String(weekStartsOn)), [weekStartsOn]);
  useEffect(() => localStorage.setItem('acti-sound', String(soundEnabled)), [soundEnabled]);

  return { username, setUsername, weekStartsOn, setWeekStartsOn, soundEnabled, setSoundEnabled };
}
