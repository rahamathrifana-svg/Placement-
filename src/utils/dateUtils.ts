export const formatDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayStr = (): string => {
  return formatDate(new Date());
};

export const addDays = (dateStr: string, n: number): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return formatDate(d);
};

export const calcStreak = (checkins: string[], today: string): number => {
  let count = 0;
  let d = today;
  if (!checkins.includes(d)) {
    d = addDays(d, -1);
  }
  while (checkins.includes(d)) {
    count++;
    d = addDays(d, -1);
  }
  return count;
};

export const calcBestStreak = (checkins: string[]): number => {
  let best = 0;
  let cur = 0;
  let prev: string | null = null;
  const sorted = [...new Set(checkins)].sort();
  for (const d of sorted) {
    if (prev && addDays(prev, 1) === d) {
      cur += 1;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
    prev = d;
  }
  return best;
};

export const calcCurDay = (start: string | null, today: string): number => {
  if (!start) return 0;
  const diffTime = new Date(today).getTime() - new Date(start).getTime();
  const diffDays = Math.floor(diffTime / 86400000) + 1;
  return Math.min(30, Math.max(1, diffDays));
};

export const calcAptitudeDay = (start: string | null, date: string): number => {
  if (!start) return 0;
  const diffTime = new Date(date).getTime() - new Date(start).getTime();
  return Math.round(diffTime / 86400000) + 1;
};
