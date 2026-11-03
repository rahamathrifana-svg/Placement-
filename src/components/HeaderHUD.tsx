import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, calcStreak } from '../utils/dateUtils.ts';
import { Cloud, CloudOff, RefreshCw, Sun, Moon, LogOut, User as UserIcon, Flame, Trophy } from 'lucide-react';

interface HeaderHUDProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({ theme, setTheme }) => {
  const { user, signOut, appState, syncStatus } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const today = todayStr();
  const streak = calcStreak(appState.checkins, today);
  const level = Math.floor(appState.xp / 100) + 1;
  const currentXP = appState.xp % 100;

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('pq_theme', next);
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-30 bg-[#14275e] text-white rounded-b-2xl px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#14275e]/40">
      {/* Level and XP */}
      <div className="flex items-center gap-3 flex-1 min-w-[240px]">
        <div className="bg-[#ffc83d] text-[#14275e] font-lilita rounded-xl px-3 py-1 text-lg tracking-wide shadow-[0_3px_0_#b88a00] flex items-center gap-1.5 shrink-0">
          <Trophy className="w-4 h-4 text-[#14275e]" />
          <span>LV {level}</span>
        </div>

        <div className="flex-1 max-w-[280px]">
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#2fbf71] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentXP}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs opacity-90 font-bold mt-0.5 px-0.5">
            <span>{currentXP} / 100 XP</span>
            <span className="text-[11px] opacity-75">{appState.xp} Total XP</span>
          </div>
        </div>
      </div>

      {/* Streak, Sync, Account, and Theme */}
      <div className="flex items-center gap-2.5">
        {/* Streak */}
        <div className="bg-white/10 hover:bg-white/15 transition px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-sm font-extrabold text-[#ffc83d]">
          <Flame className="w-4 h-4 text-[#ff5d6c] fill-[#ff5d6c] animate-pulse" />
          <span>{streak}d streak</span>
        </div>

        {/* Sync Status Badge */}
        <div
          title={
            syncStatus === 'synced'
              ? 'Synced with Cloud SQL database'
              : syncStatus === 'syncing'
              ? 'Saving progress to cloud...'
              : syncStatus === 'offline'
              ? 'Cloud sync failed. Saved locally.'
              : 'Sign in to sync across devices'
          }
          className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-black/20 text-white/90"
        >
          {syncStatus === 'syncing' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ffc83d]" />
              <span className="text-[11px] text-[#ffc83d]">Syncing</span>
            </>
          )}
          {syncStatus === 'synced' && (
            <>
              <Cloud className="w-3.5 h-3.5 text-[#2fbf71]" />
              <span className="text-[11px] text-green-300">Synced</span>
            </>
          )}
          {syncStatus === 'offline' && (
            <>
              <CloudOff className="w-3.5 h-3.5 text-[#ff5d6c]" />
              <span className="text-[11px] text-red-300">Local</span>
            </>
          )}
        </div>

        {/* Account / User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            type="button"
            className="flex items-center gap-1.5 border border-white/40 hover:border-white rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer max-w-[150px] truncate bg-white/5"
            title="User Account & Sync"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-white/60"
              />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
            <span className="truncate">{user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#14204a] text-[#0f1c3f] dark:text-[#eef2ff] border-2 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-200 dark:border-gray-700">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[#14275e]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#14275e] text-[#ffc83d] flex items-center justify-center font-bold">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-extrabold text-sm truncate">{user?.displayName || 'Adventurer'}</p>
                  <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  signOut();
                }}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-[#ff5d6c] hover:bg-[#ff4758] text-white py-2 px-3 rounded-xl font-extrabold text-xs cursor-pointer shadow-[0_2px_0_#99202a] active:translate-y-0.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="border border-white/40 hover:border-white rounded-xl p-1.5 text-sm transition cursor-pointer bg-white/5"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#ffc83d]" /> : <Moon className="w-4 h-4 text-white" />}
        </button>
      </div>
    </header>
  );
};
