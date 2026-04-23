import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function playTerminalPing() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime); // Low volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Silently fail if audio context is blocked by browser policies
  }
}

export function calculateStreak(progress: Record<string, number>): number {
  const today = new Date();
  let streak = 0;
  let d = today;

  const todayStr = format(d, 'yyyy-MM-dd');
  if (progress[todayStr] && progress[todayStr] > 0) {
    streak++;
  }

  d = subDays(today, 1);

  while (true) {
    const dateStr = format(d, 'yyyy-MM-dd');
    if (progress[dateStr] && progress[dateStr] > 0) {
      streak++;
      d = subDays(d, 1);
    } else {
      break;
    }
  }

  return streak;
}
