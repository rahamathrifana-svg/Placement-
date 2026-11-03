import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { todayStr, addDays } from '../utils/dateUtils.ts';
import { Flame, Trophy, Sparkles, CheckCircle2, Gift, Clock, Zap, Shield } from 'lucide-react';

export interface StreakData {
  streakCount: number;
  lastLoginDate: string;
  lastRewardClaimDate: string;
  highestStreak: number;
  totalClaimedRewards: number;
  totalBonusXp: number;
  updatedAt?: number;
}

const getDefaultStreakData = (): StreakData => {
  const today = todayStr();
  return {
    streakCount: 1,
    lastLoginDate: today,
    lastRewardClaimDate: '',
    highestStreak: 1,
    totalClaimedRewards: 0,
    totalBonusXp: 0,
  };
};

export const DailyStreakTracker: React.FC = () => {
  const { user, updateState, toast } = useAuth();
  const today = todayStr();
  const yesterday = addDays(today, -1);

  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const cached = localStorage.getItem(`pq_streak_${user?.uid || 'guest'}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!parsed.streakCount || parsed.streakCount < 1) {
          parsed.streakCount = 1;
          parsed.lastLoginDate = today;
          parsed.highestStreak = Math.max(parsed.highestStreak || 0, 1);
        }
        return parsed;
      }
    } catch (e) {
      // fallback
    }
    return getDefaultStreakData();
  });

  const [isClaiming, setIsClaiming] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Subscribe to Firebase Firestore Streak document
  useEffect(() => {
    if (!user) return;

    const streakRef = doc(db, 'users', user.uid, 'progress', 'streak');

    const unsubscribe = onSnapshot(
      streakRef,
      (snapshot) => {
        setIsDbConnected(true);
        if (snapshot.exists()) {
          const val = snapshot.data() as StreakData;
          if (!val.streakCount || val.streakCount < 1) {
            val.streakCount = 1;
            val.lastLoginDate = today;
            val.highestStreak = Math.max(val.highestStreak || 0, 1);
          }
          setStreakData(val);
          localStorage.setItem(`pq_streak_${user.uid}`, JSON.stringify(val));
        } else {
          // Initialize in Firestore with Day 1
          const initial = {
            userId: user.uid,
            streakCount: 1,
            lastLoginDate: today,
            lastRewardClaimDate: '',
            highestStreak: 1,
            totalClaimedRewards: 0,
            totalBonusXp: 0,
            updatedAt: Date.now(),
          };
          setDoc(streakRef, initial, { merge: true }).catch((err) => {
            console.warn('Firestore streak init note:', err);
          });
        }
      },
      (error) => {
        console.warn('Firestore streak subscription note:', error);
        setIsDbConnected(false);
      }
    );

    return () => unsubscribe();
  }, [user, today]);

  // Determine current streak state
  const isClaimedToday = streakData.lastRewardClaimDate === today;

  // Next milestone calculation
  const getNextMilestone = (current: number) => {
    if (current < 3) return { days: 3, bonus: 30, title: 'Igniter Bonus' };
    if (current < 7) return { days: 7, bonus: 75, title: 'Week Warrior' };
    if (current < 14) return { days: 14, bonus: 150, title: 'Fortnight Champion' };
    if (current < 30) return { days: 30, bonus: 300, title: 'Legendary Master' };
    return { days: current + 10, bonus: 500, title: 'Grandmaster Streak' };
  };

  const nextMilestone = getNextMilestone(streakData.streakCount);

  // Claim Daily Streak Reward
  const handleClaimReward = async () => {
    if (isClaimedToday || isClaiming) return;
    setIsClaiming(true);

    try {
      let nextStreak = 1;
      if (streakData.lastLoginDate === yesterday) {
        nextStreak = streakData.streakCount + 1;
      } else if (streakData.lastLoginDate === today) {
        nextStreak = Math.max(1, streakData.streakCount);
      } else {
        // Lapsed streak
        nextStreak = 1;
      }

      // Check for milestone bonus
      let bonusXp = 0;
      if (nextStreak === 3) bonusXp = 30;
      else if (nextStreak === 7) bonusXp = 75;
      else if (nextStreak === 14) bonusXp = 150;
      else if (nextStreak === 30) bonusXp = 300;

      const baseRewardXp = 20;
      const totalEarnedXp = baseRewardXp + bonusXp;

      const nextHighest = Math.max(streakData.highestStreak || 0, nextStreak);

      const updatedStreak: StreakData = {
        streakCount: nextStreak,
        lastLoginDate: today,
        lastRewardClaimDate: today,
        highestStreak: nextHighest,
        totalClaimedRewards: (streakData.totalClaimedRewards || 0) + 1,
        totalBonusXp: (streakData.totalBonusXp || 0) + bonusXp,
        updatedAt: Date.now(),
      };

      // 1. Update Firestore Database
      if (user) {
        const streakRef = doc(db, 'users', user.uid, 'progress', 'streak');
        await setDoc(
          streakRef,
          {
            userId: user.uid,
            ...updatedStreak,
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Firestore streak write warning:', err);
        });
      }

      // 2. Local state and storage
      setStreakData(updatedStreak);
      if (user) {
        localStorage.setItem(`pq_streak_${user.uid}`, JSON.stringify(updatedStreak));
      }

      // 3. Reward user with XP and update app checkins
      updateState(
        (prev) => ({
          ...prev,
          checkins: prev.checkins.includes(today) ? prev.checkins : [...prev.checkins, today],
        }),
        totalEarnedXp,
        bonusXp > 0
          ? `· 🔥 Streak Day ${nextStreak}! (+${bonusXp} Milestone Bonus)`
          : `· 🔥 Streak Day ${nextStreak} Claimed!`
      );

      toast(
        bonusXp > 0
          ? `🎉 Milestone Reached! ${nextStreak}-Day Streak (+${totalEarnedXp} XP total)`
          : `🔥 Daily Streak Claimed! (+${totalEarnedXp} XP)`
      );
    } catch (err) {
      console.error('Error claiming streak reward:', err);
      toast('Failed to claim reward. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  // Generate 7-day timeline (past 6 days + today)
  const timelineDays = Array.from({ length: 7 }, (_, i) => {
    const dateStr = addDays(today, i - 6);
    const dayName = new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    const isToday = dateStr === today;
    const isPastClaimed =
      isToday ? isClaimedToday : dateStr <= streakData.lastLoginDate && streakData.streakCount >= (6 - i + 1);

    return {
      dateStr,
      dayName,
      isToday,
      isClaimed: isPastClaimed,
    };
  });

  return (
    <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-3xl p-5 sm:p-6 shadow-[0_6px_0_#14275e] dark:shadow-[0_6px_0_#1d2f6b] transition-colors relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ffc83d]/15 dark:bg-[#ffc83d]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffc83d] to-[#ff5d6c] flex items-center justify-center text-white shadow-[0_3px_0_#b88a00] border-2 border-[#14275e]">
            <Flame className="w-7 h-7 fill-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl text-[#14275e] dark:text-[#ffc83d]">
              Daily Streak Tracker
            </h2>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Check in daily to earn consistent XP bonuses and maintain your learning momentum!
            </p>
          </div>
        </div>

        {/* Current streak badge */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#ff5d6c] flex items-center gap-1 justify-end font-lilita">
              <span>{streakData.streakCount}</span>
              <span className="text-base font-bold text-[#14275e] dark:text-white">Days</span>
            </div>
            <div className="text-[11px] font-black text-[#5a6685] dark:text-[#a5b1d6]">
              Record: {streakData.highestStreak || streakData.streakCount} days
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Heatmap / Timeline */}
      <div className="bg-[#eef2fb] dark:bg-[#0b1330] rounded-2xl p-3.5 border-2 border-[#14275e]/15 mb-4">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6] tracking-wider">
            7-Day Streak Timeline
          </span>
          <span className="text-xs font-black text-[#4c7dff] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            +20 Base XP / day
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {timelineDays.map((d, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition ${
                d.isToday
                  ? d.isClaimed
                    ? 'bg-[#dcf7e8] dark:bg-[#14402c] border-green-500 shadow-sm'
                    : 'bg-[#fff3cc] dark:bg-[#4a3e12] border-amber-400 animate-pulse'
                  : d.isClaimed
                  ? 'bg-white dark:bg-[#14204a] border-green-500/40 text-green-600'
                  : 'bg-white/40 dark:bg-[#14204a]/40 border-gray-200 dark:border-gray-800 text-gray-400'
              }`}
            >
              <span className="text-[11px] font-extrabold uppercase mb-1">{d.dayName}</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center">
                {d.isClaimed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2fbf71] fill-[#2fbf71]/20" />
                ) : d.isToday ? (
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-400 animate-bounce" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                )}
              </div>
              <span className="text-[10px] font-black mt-1">
                {d.isToday ? 'Today' : d.isClaimed ? 'Done' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Button & Milestone Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Next milestone prompt */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-[#ffc83d]/20 flex items-center justify-center text-[#ffc83d] shrink-0 border border-[#ffc83d]/40">
            <Trophy className="w-4 h-4 text-[#ffc83d]" />
          </div>
          <div className="text-xs font-bold">
            <div className="font-extrabold text-[#14275e] dark:text-[#ffc83d]">
              Next Goal: {nextMilestone.days}-Day {nextMilestone.title}
            </div>
            <div className="text-[#5a6685] dark:text-[#a5b1d6]">
              {Math.max(0, nextMilestone.days - streakData.streakCount)} more days for +{nextMilestone.bonus} XP
            </div>
          </div>
        </div>

        {/* Claim Action Button */}
        <div className="w-full sm:w-auto">
          {isClaimedToday ? (
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#dcf7e8] dark:bg-[#14402c] text-[#06301a] dark:text-green-200 border-2 border-[#2fbf71] rounded-2xl py-2.5 px-5 font-black text-xs sm:text-sm shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#2fbf71]" />
              <span>Today's Streak Claimed (+20 XP)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimReward}
              disabled={isClaiming}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffc83d] via-[#ffa834] to-[#ff5d6c] hover:opacity-95 text-[#14275e] border-3 border-[#14275e] rounded-2xl py-2.5 px-6 font-black text-xs sm:text-sm shadow-[0_4px_0_#14275e] active:translate-y-1 active:shadow-none transition cursor-pointer"
            >
              <Gift className="w-4 h-4 text-[#14275e]" />
              <span>{isClaiming ? 'Saving to Database...' : "Claim Today's Streak Reward"}</span>
              <Sparkles className="w-4 h-4 text-[#14275e]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
