import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, addDays } from '../utils/dateUtils.ts';
import { SK } from '../data/placementData.ts';
import { SOFT_SKILLS_CURRICULUM } from '../data/softSkillsData.ts';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Award,
  PenTool,
  CheckSquare
} from 'lucide-react';

export const SoftSkillsTab: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  const [openDay, setOpenDay] = useState<number | null>(null);

  const isStarted = Boolean(appState.start);
  const isCheckedIn = appState.checkins.includes(today);

  const getStatus = (d: number) => {
    if (!appState.start) return 'lock';
    const scheduledDate = addDays(appState.start, d - 1);
    if (scheduledDate > today) return 'lock';
    if (appState.ss[d]?.done) return 'done';
    if (scheduledDate === today) return isCheckedIn ? 'pend' : 'today';
    return 'miss';
  };

  const statusLabels: Record<string, { label: string; bg: string }> = {
    lock: { label: '🔒 Locked', bg: 'opacity-60 bg-gray-100 dark:bg-gray-800' },
    done: { label: '✅ Done', bg: 'bg-[#dcf7e8] dark:bg-[#14402c] border-green-600' },
    pend: { label: '🟡 Open', bg: 'bg-[#fff3cc] dark:bg-[#4a3e12]' },
    today: { label: '🔓 Check in first', bg: 'bg-[#e3edff] dark:bg-[#1d2f6b]' },
    miss: { label: '🔴 Missed · open', bg: 'bg-[#f3e8ff] dark:bg-[#2e2255]' },
  };

  if (!isStarted) {
    return (
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-6 shadow-[0_5px_0_#14275e]">
        <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d] mb-2">Soft Skills & Communication Quest</h2>
        <p className="text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6] mb-4">
          Start the 30-day challenge on the Home tab to unlock Day 1 of Soft Skills & Interview Prep!
        </p>
        <button
          onClick={() => {
            const yesterday = addDays(today, -1);
            updateState(
              (prev) => ({
                ...prev,
                start: yesterday,
                checkins: [yesterday],
              }),
              15,
              '· Challenge Activated! Day 2 is ready.'
            );
          }}
          className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-3 border-[#14275e] rounded-xl px-5 py-2.5 font-black shadow-[0_4px_0_#14275e] transition cursor-pointer"
        >
          Start 30-Day Challenge
        </button>
      </div>
    );
  }

  // DAY DETAIL VIEW
  if (openDay !== null) {
    const topic = SK[openDay - 1];
    const data = SOFT_SKILLS_CURRICULUM[openDay];
    const dayRecord = appState.ss[openDay] || { c: [0, 0, 0, 0, 0, 0], done: 0, n: '', r: '' };
    const isTestDay = [10, 20, 30].includes(openDay);

    const checklistItems = [
      'Learned the core concept & principles',
      'Studied the examples and frameworks',
      'Completed the daily practical activity',
      'Answered the practice questions',
      'Practiced speaking / writing aloud',
      'Recorded notes and self-reflection',
    ];

    const handleChecklistToggle = (index: number) => {
      const nextChecks = [...dayRecord.c];
      nextChecks[index] = nextChecks[index] ? 0 : 1;
      updateState((prev) => ({
        ...prev,
        ss: {
          ...prev.ss,
          [openDay]: {
            ...dayRecord,
            c: nextChecks,
          },
        },
      }));
    };

    const handleCompleteDay = () => {
      if (dayRecord.c.some((x) => !x)) {
        toast('Tick every checklist item first.');
        return;
      }
      if (isTestDay && dayRecord.sc === undefined) {
        toast('Please record your assessment score before completing the day.');
        return;
      }
      updateState(
        (prev) => ({
          ...prev,
          ss: {
            ...prev.ss,
            [openDay]: {
              ...dayRecord,
              done: 1,
            },
          },
        }),
        30,
        `· Day ${openDay} cleared!`
      );
    };

    return (
      <div className="space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpenDay(null)}
            className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Map / Roadmap</span>
          </button>
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6] flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Day {openDay} of 30
          </span>
        </div>

        {/* Title Header */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">
              Day {openDay} · {data?.title || topic}
            </h2>
            <span className="text-xs font-black bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-1 rounded-full">
              {data?.module || 'Soft Skills Module'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-bold">
            Master active listening, structured problem solving, and corporate HR interview presentation.
          </p>
        </div>

        {/* Concept Card */}
        {data && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4c7dff]" />
              <span>Core Concept & Meaning</span>
            </h3>

            {data.meaning && (
              <div className="p-3.5 bg-[#eef2fb] dark:bg-[#0b1330] rounded-xl border border-[#14275e]/20 text-xs sm:text-sm font-bold leading-relaxed text-[#0f1c3f] dark:text-[#eef2ff]">
                <span className="text-[#4c7dff] font-black uppercase block mb-1">Meaning:</span>
                {data.meaning}
              </div>
            )}

            {/* Why Is It Important */}
            {data.importance && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Why is it important?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.importance.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/15 text-xs font-bold flex items-start gap-2"
                    >
                      <span className="text-[#2fbf71] font-black shrink-0">{idx + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison Table (e.g. Day 2 Hearing vs Active Listening) */}
            {data.comparison && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Comparison Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-bold border-2 border-[#14275e] rounded-xl overflow-hidden">
                    <thead className="bg-[#14275e] text-white">
                      <tr>
                        <th className="p-2.5 text-left">Dimension</th>
                        <th className="p-2.5 text-left">Hearing</th>
                        <th className="p-2.5 text-left text-[#ffc83d]">Active Listening</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#14204a]">
                      {data.comparison.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/50 dark:bg-[#1b2b63]/30'}>
                          <td className="p-2.5 font-black text-[#5a6685] dark:text-[#a5b1d6]">{row.feature}</td>
                          <td className="p-2.5">{row.col1}</td>
                          <td className="p-2.5 text-[#2fbf71] font-black">{row.col2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Eisenhower Matrix (Day 17) */}
            {data.matrix && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Eisenhower Prioritization Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {data.matrix.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 space-y-1"
                    >
                      <div className="text-xs font-black text-[#14275e] dark:text-[#ffc83d]">{m.category}</div>
                      <div className="text-xs font-bold text-[#2fbf71]">{m.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Daily Schedule (Day 17) */}
            {data.sampleSchedule && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Recommended Daily Schedule
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {data.sampleSchedule.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#14204a] border-2 border-[#14275e]/30 text-center space-y-0.5"
                    >
                      <div className="text-xs font-black text-[#4c7dff]">{s.time}</div>
                      <div className="text-[11px] font-bold text-[#5a6685] dark:text-[#a5b1d6]">{s.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits / Positive Points */}
            {(data.benefits || data.positivePoints) && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#2fbf71] tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2fbf71]" />
                  <span>Key Benefits & Positive Habits</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs font-bold text-[#0f1c3f] dark:text-[#eef2ff]">
                  {(data.benefits || data.positivePoints)?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Negative Points to Avoid (Day 4 Body Language) */}
            {data.negativePoints && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#ff5d6c] tracking-wider">
                  Habits to Avoid:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs font-bold text-[#ff5d6c]">
                  {data.negativePoints.map((np, idx) => (
                    <li key={idx}>{np}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps Framework */}
            {data.steps && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Steps to Follow:
                </h4>
                <div className="space-y-1.5">
                  {data.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/15 text-xs font-bold flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#14275e] text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                        {idx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structure Guide (e.g. Day 21 Self-Intro, Day 23 Project, Day 27 Email) */}
            {data.structure && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Recommended Structure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.structure.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/20 text-xs font-bold flex items-center gap-2"
                    >
                      <span className="text-[#4c7dff] font-black">{idx + 1}.</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phrases */}
            {data.phrases && (
              <div className="space-y-2">
                {data.phrases.map((pGroup, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {pGroup.category && (
                      <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                        {pGroup.category}:
                      </h4>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pGroup.items.map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2.5 rounded-xl bg-[#fff3cc] dark:bg-[#4a3e12] border border-amber-300 dark:border-amber-700 text-xs font-bold text-[#14275e] dark:text-yellow-100"
                        >
                          {phrase}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sample Answer / Template */}
            {data.sampleAnswer && (
              <div className="p-4 rounded-xl bg-[#dcf7e8] dark:bg-[#14402c] border-2 border-green-600 space-y-1.5 text-xs sm:text-sm font-bold text-[#06301a] dark:text-green-100">
                <span className="font-black uppercase tracking-wider block text-green-700 dark:text-green-300">
                  Model Answer Template:
                </span>
                <p className="whitespace-pre-line leading-relaxed">{data.sampleAnswer}</p>
              </div>
            )}

            {/* HR Questions (Day 26) */}
            {data.hrQuestions && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Top 5 HR Interview Questions & Model Answers:
                </h4>
                <div className="space-y-2.5">
                  {data.hrQuestions.map((hr, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 space-y-1.5"
                    >
                      <div className="font-black text-xs sm:text-sm text-[#14275e] dark:text-[#ffc83d]">
                        Q{idx + 1}: {hr.q}
                      </div>
                      <div className="text-xs font-bold text-[#0f1c3f] dark:text-[#eef2ff] bg-white dark:bg-[#14204a] p-2.5 rounded-lg border border-[#14275e]/15 leading-relaxed">
                        {hr.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World IT Example */}
            {data.example && (
              <div className="p-3.5 rounded-xl bg-[#fff3cc] dark:bg-[#4a3e12] border-2 border-amber-400 space-y-1 text-xs sm:text-sm font-bold text-[#14275e] dark:text-amber-100">
                <span className="font-black uppercase tracking-wider block text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Real-World Workplace Example:
                </span>
                <p className="whitespace-pre-line leading-relaxed">{data.example}</p>
              </div>
            )}

            {/* Tips */}
            {data.tips && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] tracking-wider">
                  Tips & Best Practices:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">
                  {data.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Practice Questions Card */}
        {data?.practiceQuestions && data.practiceQuestions.length > 0 && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#ffc83d]" />
              <span>Practice Questions ({data.practiceQuestions.length})</span>
            </h3>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Practice answering these questions aloud or in your activity notes to prepare for interviews.
            </p>
            <div className="space-y-2">
              {data.practiceQuestions.map((pq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/20 text-xs sm:text-sm font-extrabold flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#ffc83d] text-[#14275e] flex items-center justify-center text-[10px] shrink-0 font-black">
                    {idx + 1}
                  </span>
                  <span>{pq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Practical Activity & Journal */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
          <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#2fbf71]" />
            <span>Daily Practical Activity</span>
          </h3>

          {data?.dailyActivity && (
            <div className="p-3.5 rounded-xl bg-[#dcf7e8] dark:bg-[#14402c] border-2 border-green-600 text-xs sm:text-sm font-black text-[#06301a] dark:text-green-100 flex items-start gap-2">
              <span className="text-lg shrink-0">🎯</span>
              <div>
                <span className="uppercase text-[11px] block font-black text-green-700 dark:text-green-300">
                  Today's Task:
                </span>
                <span>{data.dailyActivity}</span>
              </div>
            </div>
          )}

          {data?.practicalTask && (
            <div className="p-3 rounded-xl bg-[#fff3cc] dark:bg-[#4a3e12] border border-amber-300 text-xs font-bold text-[#14275e] dark:text-yellow-100">
              📌 {data.practicalTask}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] mb-1.5 tracking-wider">
              Activity Output & Practice Notes:
            </label>
            <textarea
              rows={4}
              placeholder="Write your activity summary, practice question answers, or bullet points here..."
              value={dayRecord.n || ''}
              onChange={(e) => {
                const val = e.target.value;
                updateState((prev) => ({
                  ...prev,
                  ss: {
                    ...prev.ss,
                    [openDay]: {
                      ...dayRecord,
                      n: val,
                    },
                  },
                }));
              }}
              className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] dark:border-[#6f8cff] rounded-xl p-3 text-xs sm:text-sm font-bold text-[#0f1c3f] dark:text-[#eef2ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#14275e] dark:text-[#ffc83d] mb-1.5 tracking-wider">
              Daily Reflection Journal:
            </label>
            <textarea
              rows={2}
              placeholder="What key communication mindset shift did you learn today?"
              value={dayRecord.r || ''}
              onChange={(e) => {
                const val = e.target.value;
                updateState((prev) => ({
                  ...prev,
                  ss: {
                    ...prev.ss,
                    [openDay]: {
                      ...dayRecord,
                      r: val,
                    },
                  },
                }));
              }}
              className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] dark:border-[#6f8cff] rounded-xl p-3 text-xs sm:text-sm font-bold text-[#0f1c3f] dark:text-[#eef2ff]"
            />
          </div>
        </div>

        {/* Assessment Score (Days 10, 20, 30) */}
        {isTestDay && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Assessment Readiness Score (%)</span>
            </h3>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Rate your confidence and readiness on this module assessment (0 to 100%).
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Score in %"
                value={dayRecord.sc !== undefined ? dayRecord.sc : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                  if (val !== undefined && (val < 0 || val > 100)) return;
                  updateState((prev) => ({
                    ...prev,
                    ss: {
                      ...prev.ss,
                      [openDay]: {
                        ...dayRecord,
                        sc: val,
                      },
                    },
                  }));
                }}
                className="bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-bold text-sm w-44"
              />
            </div>
            {dayRecord.sc !== undefined && (
              <p className="text-xs font-black">
                {dayRecord.sc >= 70 ? (
                  <span className="text-green-600">🎯 Strong Readiness! Placement & Interview Ready.</span>
                ) : (
                  <span className="text-amber-500">📈 Needs more oral practice on tone and delivery.</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Completion Checklist */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
          <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#2fbf71]" />
            <span>Daily Completion Checklist</span>
          </h3>
          <div className="space-y-2">
            {checklistItems.map((item, cIdx) => (
              <label
                key={cIdx}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/20 cursor-pointer text-xs sm:text-sm font-bold"
              >
                <input
                  type="checkbox"
                  checked={Boolean(dayRecord.c[cIdx])}
                  onChange={() => handleChecklistToggle(cIdx)}
                  className="w-4 h-4 accent-[#2fbf71]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="pt-2">
            <button
              disabled={dayRecord.done === 1}
              onClick={handleCompleteDay}
              className={`border-3 border-[#14275e] rounded-xl px-5 py-2.5 font-black text-xs sm:text-sm shadow-[0_4px_0_#14275e] active:translate-y-1 transition cursor-pointer flex items-center gap-2 ${
                dayRecord.done === 1
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{dayRecord.done === 1 ? 'Completed ✅' : 'Complete Day (+30 XP)'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3-MODULE ROADMAP VIEW
  const modules = [
    {
      title: 'Part 1: Active Listening (Days 1–10)',
      desc: 'Hearing vs listening, eye contact, body language, instruction understanding, clarification, group discussions, and note-taking.',
      start: 1,
      end: 10
    },
    {
      title: 'Part 2: Problem Solving (Days 11–20)',
      desc: 'Root cause analysis, 5 Whys, critical thinking, decision making, creative brainstorming, time management, and teamwork.',
      start: 11,
      end: 20
    },
    {
      title: 'Part 3: Soft Skills for IT Interviews (Days 21–30)',
      desc: 'Self-introduction, resume walkthrough, project explanation, communication, GD phrases, HR questions, email etiquette, and final assessment.',
      start: 21,
      end: 30
    },
  ];

  const totalCompleted = Object.values(appState.ss).filter((s) => s.done).length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
        <h1 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">Soft Skills & Interview Prep · 30 Levels</h1>
        <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-bold mt-1">
          Complete practical soft skills guide for IT placements: Active Listening, Problem Solving, and Interview Storytelling.
        </p>
        <div className="w-full h-3.5 bg-[#e3edff] dark:bg-[#1d2f6b] rounded-full overflow-hidden p-0.5 mt-3 mb-1">
          <div
            className="h-full bg-[#2fbf71] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.round((totalCompleted / 30) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
          <span>{totalCompleted} of 30 days completed</span>
          <span className="text-[#2fbf71] font-black">{Math.round((totalCompleted / 30) * 100)}%</span>
        </div>
      </div>

      {/* 3 Modules */}
      {modules.map((m, mIdx) => {
        const moduleDone = Object.keys(appState.ss).filter((k) => {
          const num = Number(k);
          return num >= m.start && num <= m.end && appState.ss[num].done;
        }).length;

        return (
          <div key={mIdx} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-lilita text-[#14275e] dark:text-[#ffc83d] uppercase tracking-wider">
                {m.title}
              </h3>
              <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
                {moduleDone} / 10 done
              </span>
            </div>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">{m.desc}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Array.from({ length: m.end - m.start + 1 }, (_, i) => {
                const dayNum = m.start + i;
                const status = getStatus(dayNum);
                const st = statusLabels[status];
                const dayData = SOFT_SKILLS_CURRICULUM[dayNum];
                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      if (status === 'lock') {
                        toast('🔒 This level unlocks on its scheduled date.');
                        return;
                      }
                      if (status === 'today') {
                        toast('Check in on Home to unlock today\'s task!');
                        return;
                      }
                      setOpenDay(dayNum);
                    }}
                    className={`text-left p-3 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer ${st.bg}`}
                  >
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>Day {dayNum}</span>
                      <span className="text-[11px]">{st.label}</span>
                    </div>
                    <div className="font-lilita text-sm sm:text-base text-[#14275e] dark:text-[#ffc83d] truncate mt-1">
                      {dayData?.title || SK[dayNum - 1]}
                    </div>
                    <div className="text-[11px] font-bold text-[#5a6685] dark:text-[#a5b1d6] truncate mt-0.5">
                      {dayData?.practiceQuestions.length || 3} Questions
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
