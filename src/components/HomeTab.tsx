import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, addDays, calcStreak, calcCurDay, calcAptitudeDay } from '../utils/dateUtils.ts';
import { TOP, APS, SK, PS } from '../data/placementData.ts';
import { Flame, Award, CheckCircle, ExternalLink, ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';
import { DailyStreakTracker } from './DailyStreakTracker.tsx';
import { DailyTaskList } from './DailyTaskList.tsx';




interface HomeTabProps {
  onNavigate: (tab: 'home' | 'ap' | 'lr' | 'ss' | 'cert' | 'proj') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigate }) => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  const isCheckedInToday = appState.checkins.includes(today);
  const curReasoningDay = appState.start ? calcCurDay(appState.start, today) : 0;
  const aptitudeStart = appState.ap?.start;
  const curAptitudeDay = aptitudeStart ? calcAptitudeDay(aptitudeStart, today) : 0;
  const isAptitudeCheckedIn = appState.ap?.ci?.includes(today);

  // Aptitude streak
  const aptitudeStreak = (() => {
    if (!aptitudeStart || !appState.ap?.ci) return 0;
    let count = 0;
    let d = isAptitudeCheckedIn ? today : addDays(today, -1);
    while (appState.ap.ci.includes(d)) {
      count++;
      d = addDays(d, -1);
    }
    return count;
  })();

  const completedCerts = appState.certs.filter((c) => c.steps?.[4]).length;
  const inProgressCerts = appState.certs.filter((c) => c.steps && c.steps.some(Boolean) && !c.steps[4]).length;

  const completedProjectSteps = PS.filter((_, i) => appState.proj[i]?.s === 'Completed').length;
  const liveProjects = (appState.pl || []).filter((p) => p.live);

  // Build daily action items
  const actions: { text: string; actionLabel: string; onAction: () => void; isStart?: boolean }[] = [];

  if (!appState.start) {
    actions.push({
      text: 'Start the 30-day Reasoning and Soft Skills challenge',
      actionLabel: 'Start Challenge',
      isStart: true,
      onAction: () => {
        const yesterday = addDays(today, -1);
        updateState(
          (prev) => ({
            ...prev,
            start: today,
            checkins: [today],
          }),
          15,
          '· Challenge started! Day 1 is ready.'
        );
      },
    });
  } else if (!isCheckedInToday) {
    actions.push({
      text: "Check in today to unlock today's Reasoning & Soft Skills quests",
      actionLabel: '⚔ Check In (+10 XP)',
      onAction: () => {
        updateState(
          (prev) => ({
            ...prev,
            checkins: prev.checkins.includes(today) ? prev.checkins : [...prev.checkins, today],
          }),
          10,
          "· Today's tasks unlocked!"
        );
      },
    });
  } else if (curReasoningDay >= 1 && curReasoningDay <= 30) {
    if (!appState.lr[curReasoningDay]?.done) {
      actions.push({
        text: `Reasoning · Day ${curReasoningDay}: ${TOP[curReasoningDay - 1]}`,
        actionLabel: 'Open Quest',
        onAction: () => onNavigate('lr'),
      });
    }
    if (!appState.ss[curReasoningDay]?.done) {
      actions.push({
        text: `Soft Skills · Day ${curReasoningDay}: ${SK[curReasoningDay - 1]}`,
        actionLabel: 'Open Quest',
        onAction: () => onNavigate('ss'),
      });
    }
  }

  if (!aptitudeStart) {
    actions.push({
      text: 'Start the 30-day Quantitative Aptitude challenge',
      actionLabel: 'Start Aptitude',
      isStart: true,
      onAction: () => {
        updateState(
          (prev) => ({
            ...prev,
            ap: {
              ...prev.ap,
              start: today,
              ci: [today],
            },
          }),
          15,
          '· Aptitude Challenge started! Day 1 is ready.'
        );
      },
    });
  } else {

    if (curAptitudeDay >= 1 && curAptitudeDay <= 30 && !appState.ap?.d?.[curAptitudeDay]?.done) {
      actions.push({
        text: `Aptitude · Day ${curAptitudeDay}: ${APS[curAptitudeDay - 1]}${isAptitudeCheckedIn ? '' : ' (check in required)'}`,
        actionLabel: isAptitudeCheckedIn ? 'Open Task' : 'Check In & Open',
        onAction: () => {
          if (!isAptitudeCheckedIn) {
            updateState(
              (prev) => ({
                ...prev,
                ap: {
                  ...prev.ap,
                  ci: [...(prev.ap?.ci || []), today],
                },
              }),
              10,
              "· Today's Aptitude unlocked!"
            );
          }
          onNavigate('ap');
        },
      });
    }
  }

  if (inProgressCerts > 0) {
    actions.push({
      text: `${inProgressCerts} certification${inProgressCerts > 1 ? 's' : ''} in progress`,
      actionLabel: 'View Certs',
      onAction: () => onNavigate('cert'),
    });
  }

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] dark:shadow-[0_5px_0_#1d2f6b]">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
              <span>Your Placement Tracking Hub</span>
              <Sparkles className="w-6 h-6 text-[#ffc83d]" />
            </h1>
            <p className="text-[#5a6685] dark:text-[#a5b1d6] font-bold text-sm sm:text-base mt-1">
              Complete your daily quests, master aptitude, build proof-of-work projects, and track certifications.
            </p>
          </div>
          <div className="flex gap-2">
            {!isCheckedInToday && appState.start && (
              <button
                onClick={() => {
                  updateState(
                    (prev) => ({
                      ...prev,
                      checkins: [...prev.checkins, today],
                    }),
                    10,
                    "· Checked in for today!"
                  );
                }}
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-3 border-[#14275e] rounded-xl px-4 py-2 font-black shadow-[0_4px_0_#14275e] active:translate-y-1 active:shadow-none transition cursor-pointer flex items-center gap-2 text-sm"
              >
                <Flame className="w-4 h-4 fill-amber-300" />
                <span>Check In Today (+10 XP)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Daily Streak Tracker Component with Firebase Realtime Database */}
      <DailyStreakTracker />

      {/* Daily Developer & LeetCode Task List with Automatic Unfinished Task Rollover */}
      <DailyTaskList />

      {/* Grid Stats */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b]">
          <div className="flex items-center gap-1.5 text-xs text-[#5a6685] dark:text-[#a5b1d6] font-extrabold uppercase">
            <Flame className="w-3.5 h-3.5 text-[#ff5d6c]" />
            <span>Daily Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14275e] dark:text-white mt-1">
            {calcStreak(appState.checkins, today)} <span className="text-xs font-bold">days</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b]">
          <div className="flex items-center gap-1.5 text-xs text-[#5a6685] dark:text-[#a5b1d6] font-extrabold uppercase">
            <Flame className="w-3.5 h-3.5 text-[#ffc83d]" />
            <span>Aptitude Streak</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14275e] dark:text-white mt-1">
            {aptitudeStreak} <span className="text-xs font-bold">days</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b]">
          <div className="flex items-center gap-1.5 text-xs text-[#5a6685] dark:text-[#a5b1d6] font-extrabold uppercase">
            <Award className="w-3.5 h-3.5 text-[#4c7dff]" />
            <span>Certs Done</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14275e] dark:text-white mt-1">
            {completedCerts} <span className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">/ {appState.certs.length}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b]">
          <div className="flex items-center gap-1.5 text-xs text-[#5a6685] dark:text-[#a5b1d6] font-extrabold uppercase">
            <CheckCircle className="w-3.5 h-3.5 text-[#2fbf71]" />
            <span>Project Steps</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14275e] dark:text-white mt-1">
            {completedProjectSteps} <span className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">/ 20</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b] col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-[#5a6685] dark:text-[#a5b1d6] font-extrabold uppercase">
            <FolderGit2 className="w-3.5 h-3.5 text-[#ffc83d]" />
            <span>Live Projects</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14275e] dark:text-white mt-1">
            {liveProjects.length} <span className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">/ {(appState.pl || []).length}</span>
          </div>
        </div>
      </div>

      {/* Action Required Today Card */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] dark:shadow-[0_5px_0_#1d2f6b]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
            <span>Action Required Today</span>
            <span className="text-xs bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-0.5 rounded-full font-bold">
              {actions.length} pending
            </span>
          </h2>
        </div>

        {actions.length > 0 ? (
          <div className="space-y-2.5">
            {actions.map((act, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 dark:border-[#6f8cff]/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffc83d]" />
                  <span className="font-extrabold text-sm sm:text-base text-[#0f1c3f] dark:text-[#eef2ff]">
                    {act.text}
                  </span>
                </div>
                <button
                  onClick={act.onAction}
                  className={`border-2 border-[#14275e] rounded-xl px-3.5 py-1.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 active:shadow-none transition cursor-pointer flex items-center gap-1.5 ${
                    act.isStart
                      ? 'bg-[#ffc83d] text-[#14275e] hover:bg-[#ffbe1a]'
                      : 'bg-[#2fbf71] text-[#06301a] hover:bg-[#28a964]'
                  }`}
                >
                  <span>{act.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-[#dcf7e8] dark:bg-[#14402c] rounded-xl border-2 border-[#2fbf71]">
            <p className="text-base font-extrabold text-[#06301a] dark:text-green-200">
              🎉 All actions completed for today! Awesome dedication. Check back tomorrow for the next quest.
            </p>
          </div>
        )}
      </div>

      {/* Project Tracker Card */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] dark:shadow-[0_5px_0_#1d2f6b]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">Project Tracker</h2>
          <span className="text-sm font-black text-[#5a6685] dark:text-[#a5b1d6]">
            {completedProjectSteps} / 20 steps ({completedProjectSteps * 5}%)
          </span>
        </div>

        <div className="w-full h-3.5 bg-[#e3edff] dark:bg-[#1d2f6b] rounded-full overflow-hidden p-0.5 mb-4">
          <div
            className="h-full bg-[#2fbf71] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completedProjectSteps * 5}%` }}
          />
        </div>

        {(appState.pl || []).length > 0 ? (
          <div className="space-y-2 mb-4">
            {(appState.pl || []).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20"
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm">{project.name}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      project.live ? 'bg-[#dcf7e8] text-[#06301a]' : 'bg-[#fff3cc] text-[#14275e]'
                    }`}
                  >
                    {project.live ? '✅ Live Deployed' : '🛠 Building'}
                  </span>
                </div>
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition flex items-center gap-1"
                  >
                    <span>Open Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => onNavigate('proj')}
                    className="text-xs text-[#4c7dff] hover:underline font-extrabold cursor-pointer"
                  >
                    Add Live URL
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold mb-3">
            No projects added yet. Build your student assignment tracker or portfolio application in the Project tab.
          </p>
        )}

        <button
          onClick={() => onNavigate('proj')}
          className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
        >
          Open Project Quest
        </button>
      </div>

      {/* Quick Quest Launchers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { tab: 'ap' as const, label: '➗ Quantitative Aptitude', desc: '30 Daily Levels & Formulas' },
          { tab: 'lr' as const, label: '🧠 Logical Reasoning', desc: 'Quizzes & Puzzles' },
          { tab: 'ss' as const, label: '🗣 Soft Skills & HR', desc: 'Active Listening & Mock Prep' },
          { tab: 'cert' as const, label: '🎓 Free Certifications', desc: '15 Platforms & LinkedIn Prep' },
          { tab: 'proj' as const, label: '🛠 20-Step Project Guide', desc: 'SRS, Architecture & Deploy' },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => onNavigate(item.tab)}
            className="text-left bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b] hover:-translate-y-0.5 transition cursor-pointer"
          >
            <div className="font-lilita text-base sm:text-lg text-[#14275e] dark:text-[#ffc83d] truncate">
              {item.label}
            </div>
            <div className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold mt-1">
              {item.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
