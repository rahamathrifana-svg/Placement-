import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, calcCurDay } from '../utils/dateUtils.ts';
import {
  DAILY_DEV_TASKS,
  DEV_WEEKS,
  DailyDevTask,
} from '../data/dailyDevTasksData.ts';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Flame,
  AlertTriangle,
  Code2,
  Calendar,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  FolderGit2,
  ArrowRight,
} from 'lucide-react';

interface CarriedOverTask {
  id: string;
  originalDay: number;
  type: 'main' | 'leetcode' | 'custom';
  title: string;
  leetcodeUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  customTaskId?: string;
}

export const DailyTaskList: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  // Current challenge day (default 1 based on start date today)
  const curDay = appState.start ? Math.min(29, Math.max(1, calcCurDay(appState.start, today))) : 1;


  // Selected day for viewing details (defaults to curDay)
  const [selectedDay, setSelectedDay] = useState<number>(curDay);
  const [activeWeekTab, setActiveWeekTab] = useState<number | 'all'>('all');
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [filterMode, setFilterMode] = useState<'today' | 'all' | 'carried'>('today');

  const devStatus = appState.devTasks?.days || {};
  const customTasks = appState.devTasks?.customTasks || [];

  // Toggle Main Task for a given day
  const handleToggleMainTask = (dayNum: number) => {
    const isDone = Boolean(devStatus[dayNum]?.mainDone);
    const nextStatus = !isDone;

    updateState(
      (prev) => ({
        ...prev,
        devTasks: {
          ...prev.devTasks,
          days: {
            ...(prev.devTasks?.days || {}),
            [dayNum]: {
              ...(prev.devTasks?.days?.[dayNum] || {}),
              mainDone: nextStatus,
              completedAt: nextStatus ? today : undefined,
            },
          },
        },
      }),
      nextStatus ? 15 : 0,
      nextStatus ? `· Day ${dayNum} Main Task completed!` : '· Task marked pending'
    );

    toast(nextStatus ? `🎉 Day ${dayNum} Main Task Completed! (+15 XP)` : `Task marked uncompleted.`);
  };

  // Toggle LeetCode Practice for a given day
  const handleToggleLeetCode = (dayNum: number) => {
    const isDone = Boolean(devStatus[dayNum]?.leetcodeDone);
    const nextStatus = !isDone;

    updateState(
      (prev) => ({
        ...prev,
        devTasks: {
          ...prev.devTasks,
          days: {
            ...(prev.devTasks?.days || {}),
            [dayNum]: {
              ...(prev.devTasks?.days?.[dayNum] || {}),
              leetcodeDone: nextStatus,
              completedAt: nextStatus ? today : undefined,
            },
          },
        },
      }),
      nextStatus ? 15 : 0,
      nextStatus ? `· Day ${dayNum} LeetCode Solved!` : '· LeetCode marked pending'
    );

    toast(nextStatus ? `🔥 Day ${dayNum} LeetCode Solved! (+15 XP)` : `LeetCode marked uncompleted.`);
  };

  // Add custom task
  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newCustomTaskText.trim();
    if (!text) return;

    const newTask = {
      id: `task_${Date.now()}`,
      dayNumber: curDay,
      title: text,
      done: false,
      createdAt: today,
    };

    updateState((prev) => ({
      ...prev,
      devTasks: {
        ...prev.devTasks,
        customTasks: [...(prev.devTasks?.customTasks || []), newTask],
      },
    }));

    setNewCustomTaskText('');
    toast('Custom task added to today\'s checklist!');
  };

  // Toggle custom task
  const handleToggleCustomTask = (id: string) => {
    const task = customTasks.find((t) => t.id === id);
    if (!task) return;
    const nextDone = !task.done;

    updateState(
      (prev) => ({
        ...prev,
        devTasks: {
          ...prev.devTasks,
          customTasks: (prev.devTasks?.customTasks || []).map((t) =>
            t.id === id ? { ...t, done: nextDone } : t
          ),
        },
      }),
      nextDone ? 10 : 0,
      nextDone ? '· Custom task completed!' : '· Custom task uncompleted'
    );

    toast(nextDone ? 'Custom task completed! (+10 XP)' : 'Task marked pending.');
  };

  // Delete custom task
  const handleDeleteCustomTask = (id: string) => {
    updateState((prev) => ({
      ...prev,
      devTasks: {
        ...prev.devTasks,
        customTasks: (prev.devTasks?.customTasks || []).filter((t) => t.id !== id),
      },
    }));
    toast('Custom task deleted.');
  };

  // AUTOMATIC UNFINISHED TASK ROLLOVER COMPUTATION
  // Any task from day 1 up to (curDay - 1) that is not completed is added to carried-over tasks!
  const carriedOverTasks: CarriedOverTask[] = [];

  for (let d = 1; d < curDay; d++) {
    const taskDef = DAILY_DEV_TASKS.find((t) => t.day === d);
    if (!taskDef) continue;

    const dStatus = devStatus[d] || {};

    if (!dStatus.mainDone) {
      carriedOverTasks.push({
        id: `main_day_${d}`,
        originalDay: d,
        type: 'main',
        title: taskDef.mainTask,
      });
    }

    if (!dStatus.leetcodeDone) {
      carriedOverTasks.push({
        id: `leetcode_day_${d}`,
        originalDay: d,
        type: 'leetcode',
        title: `LeetCode: ${taskDef.leetcode}`,
        leetcodeUrl: taskDef.leetcodeUrl,
        difficulty: taskDef.difficulty,
      });
    }
  }

  // Also carry over any unfinished custom tasks from earlier days
  customTasks
    .filter((ct) => ct.dayNumber < curDay && !ct.done)
    .forEach((ct) => {
      carriedOverTasks.push({
        id: ct.id,
        originalDay: ct.dayNumber,
        type: 'custom',
        title: ct.title,
        customTaskId: ct.id,
      });
    });

  // Calculate overall stats
  let totalMainDone = 0;
  let totalLeetcodeDone = 0;
  for (let d = 1; d <= 29; d++) {
    if (devStatus[d]?.mainDone) totalMainDone++;
    if (devStatus[d]?.leetcodeDone) totalLeetcodeDone++;
  }
  const totalTasksCount = 29 * 2;
  const completedCount = totalMainDone + totalLeetcodeDone;
  const progressPercent = Math.round((completedCount / totalTasksCount) * 100);

  // Active today task definition
  const todayTaskDef = DAILY_DEV_TASKS.find((t) => t.day === curDay) || DAILY_DEV_TASKS[0];
  const todayStatus = devStatus[curDay] || {};
  const currentWeekInfo = DEV_WEEKS.find((w) => w.week === todayTaskDef.week) || DEV_WEEKS[0];

  return (
    <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] dark:shadow-[0_5px_0_#1d2f6b] space-y-5">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2 font-lilita">
              <span>Daily Developer & LeetCode Task List</span>
              <Sparkles className="w-5 h-5 text-[#ffc83d]" />
            </h2>
            <span className="bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-0.5 rounded-full text-xs font-black">
              Day {curDay} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6] mt-0.5">
            29-Day Developer Setup, LeetCode Practice, and Proof-of-Work Projects.
            <span className="text-[#e23636] dark:text-[#ff7b7b] ml-1">
              Unfinished tasks automatically carry over to the next day!
            </span>
          </p>
        </div>

        {/* View Filters */}
        <div className="flex flex-wrap gap-1.5 bg-[#eef2fb] dark:bg-[#0b1330] p-1 rounded-xl border border-[#14275e]/20">
          <button
            onClick={() => setFilterMode('today')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              filterMode === 'today'
                ? 'bg-[#14275e] text-[#ffc83d] shadow-sm'
                : 'text-[#5a6685] dark:text-[#a5b1d6] hover:text-[#14275e]'
            }`}
          >
            Today's Focus
          </button>
          <button
            onClick={() => setFilterMode('carried')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
              filterMode === 'carried'
                ? 'bg-[#ff5d6c] text-white shadow-sm'
                : 'text-[#5a6685] dark:text-[#a5b1d6] hover:text-[#ff5d6c]'
            }`}
          >
            <span>Carried Over</span>
            {carriedOverTasks.length > 0 && (
              <span className="bg-white text-[#ff5d6c] px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {carriedOverTasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#14275e] text-[#ffc83d] shadow-sm'
                : 'text-[#5a6685] dark:text-[#a5b1d6] hover:text-[#14275e]'
            }`}
          >
            All 29 Days
          </button>
        </div>
      </div>

      {/* Progress Overview Bar */}
      <div className="bg-[#eef2fb] dark:bg-[#0b1330] p-3 rounded-xl border border-[#14275e]/15">
        <div className="flex justify-between items-center text-xs font-black mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[#14275e] dark:text-[#eef2ff]">Overall Developer Roadmap</span>
            <span className="text-[#2fbf71] font-bold">
              {completedCount} of {totalTasksCount} tasks done ({progressPercent}%)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4c7dff]">Main: {totalMainDone}/29</span>
            <span className="text-[#ffc83d]">LeetCode: {totalLeetcodeDone}/29</span>
          </div>
        </div>
        <div className="w-full h-3 bg-white dark:bg-gray-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#4c7dff] via-[#2fbf71] to-[#ffc83d] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* SECTION 1: UNFINISHED TASKS CARRIED OVER FROM PREVIOUS DAYS */}
      {(filterMode === 'today' || filterMode === 'carried') && carriedOverTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#fff2f2] dark:bg-[#34161c] border-2 border-[#ff5d6c] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ff5d6c] animate-bounce" />
              <h3 className="text-base sm:text-lg font-lilita text-[#a31221] dark:text-[#ff929d]">
                Carried Over Unfinished Tasks ({carriedOverTasks.length})
              </h3>
            </div>
            <span className="text-[11px] font-black uppercase bg-[#ff5d6c] text-white px-2.5 py-0.5 rounded-full">
              Rolled into Today
            </span>
          </div>
          <p className="text-xs text-[#a31221] dark:text-[#ffb3bc] font-bold">
            These tasks from earlier days were not finished yet and have been automatically added to today's priority list so you can catch up!
          </p>

          <div className="space-y-2">
            {carriedOverTasks.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-white dark:bg-[#1e131d] border border-[#ff5d6c]/30 shadow-sm"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-[240px]">
                  <button
                    onClick={() => {
                      if (t.type === 'main') handleToggleMainTask(t.originalDay);
                      else if (t.type === 'leetcode') handleToggleLeetCode(t.originalDay);
                      else if (t.customTaskId) handleToggleCustomTask(t.customTaskId);
                    }}
                    className="mt-0.5 text-gray-400 hover:text-[#2fbf71] transition cursor-pointer"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-[#ffdddd] dark:bg-[#4a1c23] text-[#a31221] dark:text-[#ff929d]">
                        Day {t.originalDay} Pending
                      </span>
                      {t.difficulty && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            t.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {t.difficulty}
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm text-[#0f1c3f] dark:text-[#eef2ff]">
                      {t.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {t.leetcodeUrl && (
                    <a
                      href={t.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#fff3cc] dark:bg-[#4a3e12] hover:bg-[#ffe699] text-[#14275e] dark:text-[#ffc83d] border border-[#14275e]/20 rounded-lg px-2.5 py-1 text-xs font-black transition flex items-center gap-1"
                    >
                      <span>Solve on LeetCode</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (t.type === 'main') handleToggleMainTask(t.originalDay);
                      else if (t.type === 'leetcode') handleToggleLeetCode(t.originalDay);
                      else if (t.customTaskId) handleToggleCustomTask(t.customTaskId);
                    }}
                    className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-3 py-1 font-black text-xs shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Done (+15 XP)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: TODAY'S PRIMARY TASKS (DAY curDay) */}
      {(filterMode === 'today' || filterMode === 'carried') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4c7dff]" />
              <h3 className="text-lg sm:text-xl font-lilita text-[#14275e] dark:text-[#ffc83d]">
                Today's Scheduled Tasks · Day {curDay}
              </h3>
            </div>
            <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
              Week {todayTaskDef.week} · {currentWeekInfo.title}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Main Developer Task */}
            <div
              className={`p-4 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b] flex flex-col justify-between transition ${
                todayStatus.mainDone
                  ? 'bg-[#dcf7e8] dark:bg-[#14402c]'
                  : 'bg-white dark:bg-[#1a285a]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff]">
                    Main Developer Task
                  </span>
                  {todayStatus.mainDone ? (
                    <span className="text-xs font-black text-[#2fbf71] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-500">Pending</span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm sm:text-base text-[#0f1c3f] dark:text-[#eef2ff] mb-1.5 leading-snug">
                  {todayTaskDef.mainTask}
                </h4>

                {todayTaskDef.description && (
                  <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold mb-3 leading-relaxed">
                    {todayTaskDef.description}
                  </p>
                )}

                {todayTaskDef.tips && todayTaskDef.tips.length > 0 && (
                  <div className="bg-[#eef2fb] dark:bg-[#0b1330] p-2.5 rounded-xl border border-[#14275e]/15 mb-3 text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6] space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4c7dff] block">
                      💡 Pro Tips:
                    </span>
                    {todayTaskDef.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#ffc83d]">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#14275e]/15 flex items-center justify-between">
                <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
                  Reward: +15 XP
                </span>
                <button
                  onClick={() => handleToggleMainTask(curDay)}
                  className={`border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5 ${
                    todayStatus.mainDone
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{todayStatus.mainDone ? 'Completed ✅' : 'Complete Task'}</span>
                </button>
              </div>
            </div>

            {/* LeetCode Practice Task */}
            <div
              className={`p-4 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b] flex flex-col justify-between transition ${
                todayStatus.leetcodeDone
                  ? 'bg-[#dcf7e8] dark:bg-[#14402c]'
                  : 'bg-white dark:bg-[#1a285a]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-[#fff3cc] dark:bg-[#4a3e12] text-[#14275e] dark:text-[#ffc83d]">
                      LeetCode Practice
                    </span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        todayTaskDef.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {todayTaskDef.difficulty}
                    </span>
                  </div>
                  {todayStatus.leetcodeDone ? (
                    <span className="text-xs font-black text-[#2fbf71] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Solved
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-500">Unsolved</span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm sm:text-base text-[#0f1c3f] dark:text-[#eef2ff] mb-1.5">
                  {todayTaskDef.leetcode}
                </h4>

                <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold mb-4 leading-relaxed">
                  Practice problem-solving patterns. Understand edge cases, time complexity O(n), and space optimization.
                </p>

                <div className="mb-4">
                  <a
                    href={todayTaskDef.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#14275e] hover:bg-[#1b347a] text-[#ffc83d] rounded-xl px-3.5 py-1.5 text-xs font-black shadow-[0_2px_0_#0a1433] active:translate-y-0.5 transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open Problem in LeetCode</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#14275e]/15 flex items-center justify-between">
                <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
                  Reward: +15 XP
                </span>
                <button
                  onClick={() => handleToggleLeetCode(curDay)}
                  className={`border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5 ${
                    todayStatus.leetcodeDone
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{todayStatus.leetcodeDone ? 'Solved ✅' : 'Mark Solved'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Today's Custom Tasks */}
          <div className="p-4 rounded-2xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-[#14275e] dark:text-[#6f8cff] tracking-wider">
                Personal Study Checklist for Day {curDay}
              </span>
              <span className="text-[11px] font-bold text-[#5a6685] dark:text-[#a5b1d6]">
                Unfinished items roll over to tomorrow
              </span>
            </div>

            {/* Custom Task Input */}
            <form onSubmit={handleAddCustomTask} className="flex gap-2">
              <input
                type="text"
                value={newCustomTaskText}
                onChange={(e) => setNewCustomTaskText(e.target.value)}
                placeholder="Add a custom daily task (e.g. review SQL syntax, practice 5 min git commands)..."
                className="flex-1 bg-white dark:bg-[#14204a] border-2 border-[#14275e]/30 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-[#14275e] dark:text-white focus:outline-none focus:border-[#4c7dff]"
              />
              <button
                type="submit"
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-3.5 py-1.5 font-black text-xs shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Custom Tasks List for today */}
            {customTasks.filter((ct) => ct.dayNumber === curDay).length > 0 ? (
              <div className="space-y-1.5">
                {customTasks
                  .filter((ct) => ct.dayNumber === curDay)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#14204a] border border-[#14275e]/15 text-xs sm:text-sm font-bold"
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleCustomTask(task.id)}
                          className="w-4 h-4 accent-[#2fbf71]"
                        />
                        <span className={task.done ? 'line-through text-gray-400' : 'text-[#0f1c3f] dark:text-[#eef2ff]'}>
                          {task.title}
                        </span>
                      </label>
                      <button
                        onClick={() => handleDeleteCustomTask(task.id)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
                No custom tasks added for today. Click "Add Task" to create personal revision notes or study items.
              </p>
            )}
          </div>

          {/* Week Goal & Deliverables Banner */}
          <div className="bg-[#fff9e6] dark:bg-[#282210] border-2 border-[#ffc83d] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#966b00] dark:text-[#ffc83d]">
                Week {currentWeekInfo.week} Goal & Deliverables
              </span>
              <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
                {currentWeekInfo.daysRange}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-[#3a2800] dark:text-amber-100">
              🎯 {currentWeekInfo.goal}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs font-bold text-[#5a6685] dark:text-amber-200/80">
              {currentWeekInfo.deliverables.map((del, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#2fbf71]">✔</span>
                  <span>{del}</span>
                </li>
              ))}
            </ul>

            {currentWeekInfo.project && (
              <div className="mt-3 pt-3 border-t border-[#ffc83d]/30">
                <div className="flex items-center gap-1.5 mb-1 text-xs font-black text-[#14275e] dark:text-[#ffc83d]">
                  <FolderGit2 className="w-4 h-4 text-[#ffc83d]" />
                  <span>{currentWeekInfo.project.title}</span>
                </div>
                <p className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6] mb-2">
                  {currentWeekInfo.project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentWeekInfo.project.features.map((feat, fi) => (
                    <span
                      key={fi}
                      className="text-[11px] font-black bg-white dark:bg-[#14204a] text-[#14275e] dark:text-[#6f8cff] px-2 py-0.5 rounded-md border border-[#14275e]/15"
                    >
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: ALL 29 DAYS CURRICULUM ROADMAP VIEW */}
      {filterMode === 'all' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b border-[#14275e]/15 pb-2">
            <button
              onClick={() => setActiveWeekTab('all')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                activeWeekTab === 'all'
                  ? 'bg-[#14275e] text-[#ffc83d]'
                  : 'bg-[#eef2fb] dark:bg-[#0b1330] text-[#5a6685] dark:text-[#a5b1d6]'
              }`}
            >
              All Weeks (29 Days)
            </button>
            {DEV_WEEKS.map((w) => (
              <button
                key={w.week}
                onClick={() => setActiveWeekTab(w.week)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeWeekTab === w.week
                    ? 'bg-[#14275e] text-[#ffc83d]'
                    : 'bg-[#eef2fb] dark:bg-[#0b1330] text-[#5a6685] dark:text-[#a5b1d6]'
                }`}
              >
                Week {w.week} ({w.daysRange})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {DEV_WEEKS.filter((w) => activeWeekTab === 'all' || activeWeekTab === w.week).map((w) => (
              <div key={w.week} className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-lilita text-[#14275e] dark:text-[#ffc83d]">
                      Week {w.week} – {w.title} ({w.daysRange})
                    </h3>
                    <p className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">{w.goal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {DAILY_DEV_TASKS.filter((t) => t.week === w.week).map((task) => {
                    const st = devStatus[task.day] || {};
                    const isAllDone = st.mainDone && st.leetcodeDone;
                    const isToday = task.day === curDay;

                    return (
                      <div
                        key={task.day}
                        className={`p-3 rounded-2xl border-2 transition ${
                          isAllDone
                            ? 'bg-[#dcf7e8] dark:bg-[#14402c] border-green-600'
                            : isToday
                            ? 'bg-[#fff9e6] dark:bg-[#282210] border-[#ffc83d] ring-2 ring-[#ffc83d]'
                            : 'bg-[#eef2fb] dark:bg-[#0b1330] border-[#14275e]/20'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-black mb-1.5">
                          <span className="flex items-center gap-1">
                            <span>Day {task.day}</span>
                            {isToday && (
                              <span className="text-[10px] bg-[#ffc83d] text-[#14275e] px-1.5 py-0.2 rounded font-black">
                                Today
                              </span>
                            )}
                          </span>
                          <span className="text-[11px]">
                            {isAllDone ? '✅ Complete' : st.mainDone || st.leetcodeDone ? '🟡 1/2' : '⚪ Pending'}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-start gap-2 text-xs font-bold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(st.mainDone)}
                              onChange={() => handleToggleMainTask(task.day)}
                              className="w-3.5 h-3.5 mt-0.5 accent-[#2fbf71]"
                            />
                            <span className={st.mainDone ? 'line-through text-gray-500' : 'text-[#0f1c3f] dark:text-[#eef2ff]'}>
                              {task.mainTask}
                            </span>
                          </label>

                          <div className="flex items-center justify-between pt-1 border-t border-[#14275e]/10 text-xs">
                            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(st.leetcodeDone)}
                                onChange={() => handleToggleLeetCode(task.day)}
                                className="w-3.5 h-3.5 accent-[#ffc83d]"
                              />
                              <span className={st.leetcodeDone ? 'line-through text-gray-500' : 'text-[#4c7dff]'}>
                                {task.leetcode}
                              </span>
                            </label>
                            <a
                              href={task.leetcodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-[#14275e] dark:hover:text-[#ffc83d]"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {w.project && (
                  <div className="p-3 rounded-xl bg-white dark:bg-[#14204a] border-2 border-[#14275e]/20 text-xs font-bold space-y-1">
                    <span className="text-[#ffc83d] font-lilita text-sm block">
                      📁 {w.project.title}
                    </span>
                    <p className="text-[#5a6685] dark:text-[#a5b1d6]">{w.project.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {w.project.features.map((f, fi) => (
                        <span
                          key={fi}
                          className="bg-[#eef2fb] dark:bg-[#0b1330] text-[#14275e] dark:text-[#6f8cff] px-2 py-0.5 rounded text-[10px]"
                        >
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
