import { useState, useEffect } from 'react';

export type ThemeName = 'hacker' | 'cyberpunk' | 'synthwave' | 'matrix' | 'monochrome';

export const THEMES: { id: ThemeName; name: string; displayColor: string }[] = [
  { id: 'hacker', name: 'Original Hacker', displayColor: '#38bdf8' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', displayColor: '#ff003c' },
  { id: 'synthwave', name: 'Synthwave', displayColor: '#a855f7' },
  { id: 'matrix', name: 'The Matrix', displayColor: '#00ff41' },
  { id: 'monochrome', name: 'Monochrome', displayColor: '#e5e5e5' },
];

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('acti-track-theme');
    return (saved as ThemeName) || 'hacker';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('acti-track-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
