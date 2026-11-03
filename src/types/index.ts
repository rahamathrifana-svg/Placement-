export interface CertificationItem {
  id: string;
  name: string;
  plat: string;
  start?: string;
  end?: string;
  link?: string;
  skills?: string;
  curl?: string;
  file?: {
    name: string;
    data: string; // Base64
  } | null;
  steps: number[]; // Array of 6 steps: 0 or 1
}

export interface ProjectLink {
  id: string;
  name: string;
  live?: string;
  gh?: string;
}

export interface AptitudeDayRecord {
  c: number[]; // 5 checklist items
  done: number;
  ms?: number;
  pr?: number;
  qz?: {
    best: number;
    n: number;
  };
}

export interface SoftSkillsDayRecord {
  c: number[]; // 6 checklist items
  n?: string;
  r?: string;
  sc?: number;
  done: number;
}

export interface ReasoningDayRecord {
  c: number[]; // 5 checklist items
  done: number;
  ms?: number;
}

export interface QuizRecord {
  best: number;
  n: number;
  hist: number[];
}

export interface DailyDevTaskStatus {
  mainDone?: boolean;
  leetcodeDone?: boolean;
  notes?: string;
  completedAt?: string;
}

export interface CustomTaskItem {
  id: string;
  dayNumber: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface AppState {
  xp: number;
  start: string | null;
  checkins: string[];
  lr: Record<number, ReasoningDayRecord>;
  quiz: Record<number, QuizRecord>;
  certs: CertificationItem[];
  marks: string[];
  li: Record<string, { c: number[]; done: number }>;
  proj: Record<number, {
    s: 'Not Started' | 'In Progress' | 'Completed';
    g?: number[];
    d?: string;
    n?: string;
  }>;
  pl: ProjectLink[];
  theme: 'light' | 'dark' | null;
  ap: {
    start: string | null;
    ci: string[];
    d: Record<number, AptitudeDayRecord>;
    max: string;
  };
  ss: Record<number, SoftSkillsDayRecord>;
  devTasks?: {
    days?: Record<number, DailyDevTaskStatus>;
    customTasks?: CustomTaskItem[];
  };
}

import { todayStr } from '../utils/dateUtils.ts';

export const getInitialState = (): AppState => {
  const today = todayStr();
  return {
    xp: 20,
    start: today,
    checkins: [today],
    lr: {
      1: { c: [0, 0, 0, 0, 0], done: 0 },
    },
    quiz: {},
    certs: [],
    marks: [],
    li: {},
    proj: {},
    pl: [],
    theme: null,
    ap: {
      start: today,
      ci: [today],
      d: {
        1: { c: [0, 0, 0, 0, 0], done: 0 },
      },
      max: today,
    },
    ss: {
      1: { c: [0, 0, 0, 0, 0, 0], done: 0 },
    },
    devTasks: {
      days: {},
      customTasks: [],
    },
  };
};

export const INITIAL_STATE: AppState = getInitialState();


