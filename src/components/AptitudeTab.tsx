import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, addDays, formatDate, calcAptitudeDay, calcStreak, calcBestStreak } from '../utils/dateUtils.ts';
import { APS, NT, CURATED_APTITUDE_PRACTICE } from '../data/placementData.ts';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AptitudeTab: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  const aptitude = appState.ap || { start: null, ci: [], d: {}, max: '' };
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [curatedAnswers, setCuratedAnswers] = useState<Record<number, Record<number, number>>>({});
  const [curatedChecked, setCuratedChecked] = useState<Record<number, boolean>>({});
  const [sundayScoreInput, setSundayScoreInput] = useState<string>('');


  const isStarted = Boolean(aptitude.start);
  const curDayNum = isStarted ? calcAptitudeDay(aptitude.start!, today) : 0;
  const isCheckedIn = aptitude.ci.includes(today);

  // Status helper for day n (1..30)
  const getDayStatus = (n: number) => {
    if (!aptitude.start) return 'lock';
    const scheduledDate = addDays(aptitude.start, n - 1);
    if (scheduledDate > today) return 'lock';
    if (aptitude.d[n]?.done) return 'done';
    if (scheduledDate === today) return isCheckedIn ? 'pend' : 'today';
    return 'miss';
  };

  const statusLabels: Record<string, { label: string; bg: string; badge: string }> = {
    lock: { label: '🔒 Locked', bg: 'opacity-60 bg-gray-100 dark:bg-gray-800', badge: '🔒 Locked' },
    done: { label: '✅ Done', bg: 'bg-[#dcf7e8] dark:bg-[#14402c] border-green-600', badge: '✅ Done' },
    pend: { label: '🟡 Open', bg: 'bg-[#fff3cc] dark:bg-[#4a3e12]', badge: '🟡 Open' },
    today: { label: '🔓 Check in first', bg: 'bg-[#e3edff] dark:bg-[#1d2f6b] animate-pulse', badge: '🔓 Check in' },
    miss: { label: '🔴 Missed · open', bg: 'bg-[#f3e8ff] dark:bg-[#2e2255]', badge: '🔴 Missed' },
  };

  const handleStartChallenge = () => {
    const yesterday = addDays(today, -1);
    updateState(
      (prev) => ({
        ...prev,
        ap: {
          start: yesterday,
          ci: [yesterday],
          d: { 1: { c: [1, 1, 1, 1, 1], done: 1, pr: 1 } },
          max: yesterday,
        },
      }),
      20,
      '· Aptitude Quest Activated! Day 2 is ready.'
    );
  };

  const handleCheckIn = () => {
    if (isCheckedIn) return;
    updateState(
      (prev) => ({
        ...prev,
        ap: {
          ...prev.ap,
          ci: [...prev.ap.ci, today],
        },
      }),
      10,
      "· Today's Aptitude Unlocked!"
    );
  };

  if (!isStarted) {
    return (
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-6 shadow-[0_5px_0_#14275e]">
        <h1 className="text-2xl sm:text-3xl text-[#14275e] dark:text-[#ffc83d] mb-2">Quantitative Aptitude Dashboard</h1>
        <p className="text-[#5a6685] dark:text-[#a5b1d6] font-bold mb-4">
          Embark on the 30-Day Quantitative Aptitude challenge! Master Number Systems, Percentages, Profit & Loss, Simple and Compound Interest, Time & Work, Speed, Geometry, Probability, and Data Interpretation.
        </p>
        <button
          onClick={handleStartChallenge}
          className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-3 border-[#14275e] rounded-xl px-5 py-2.5 font-black shadow-[0_4px_0_#14275e] active:translate-y-1 transition cursor-pointer text-sm sm:text-base"
        >
          ⚔ Start 30-Day Aptitude Challenge
        </button>
      </div>
    );
  }

  // DAY DETAIL VIEW
  if (openDay !== null) {
    const topic = APS[openDay - 1];
    const isSunday = topic.startsWith('Sunday');
    const dayRecord = aptitude.d[openDay] || { c: [0, 0, 0, 0, 0], done: 0 };
    const checkedCount = dayRecord.c.reduce((a, b) => a + b, 0);
    const completionPercent = dayRecord.done ? 100 : checkedCount * 20;

    const curatedQuestions = CURATED_APTITUDE_PRACTICE[openDay] || [];

    const handleCheckCuratedPractice = () => {
      if (!curatedQuestions || curatedQuestions.length === 0) return;
      setCuratedChecked((prev) => ({ ...prev, [openDay]: true }));
      const dayAns = curatedAnswers[openDay] || {};

      let correctCount = 0;
      curatedQuestions.forEach((q, idx) => {
        if (dayAns[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const nextChecks = [...dayRecord.c];
      nextChecks[2] = 1; // Completed 20 practical quiz questions
      nextChecks[3] = 1; // Reviewed solutions & explanations
      updateState(
        (prev) => ({
          ...prev,
          ap: {
            ...prev.ap,
            d: {
              ...prev.ap.d,
              [openDay]: {
                ...dayRecord,
                c: nextChecks,
                pr: 1,
                qz: {
                  best: Math.max(dayRecord.qz?.best || 0, correctCount),
                  n: (dayRecord.qz?.n || 0) + 1,
                },
                done: isSunday ? 1 : dayRecord.done,
              },
            },
          },
        }),
        correctCount * (isSunday ? 2 : 1),
        `· ${topic} Practical Quiz: ${correctCount}/${curatedQuestions.length} correct`
      );
      toast(`Practical Quiz Checked! Score: ${correctCount} / ${curatedQuestions.length} (+${correctCount * (isSunday ? 2 : 1)} XP)`);
    };

    const checklistItems = [
      'Learned the concept',
      'Reviewed the formulas & shortcuts',
      'Completed 20 practical quiz questions',
      'Reviewed solutions & explanations',
      'Revised key rules & formulas',
    ];

    const sundayTargets: Record<string, [number, number]> = {
      'Sunday Test 1': [30, 24],
      'Sunday Test 2': [30, 24],
      'Sunday Test 3': [35, 28],
      'Sunday Test 4': [40, 32],
    };
    const sundayTarget = sundayTargets[topic];

    // Split compound topics (e.g. "Boats and Streams + Problems on Clocks", "Algebra + Geometry and Mensuration")
    const subTopics = topic.split(' + ').map((t) => t.trim()).filter((t) => NT[t]);

    const handleChecklistToggle = (index: number) => {
      const nextChecks = [...dayRecord.c];
      nextChecks[index] = nextChecks[index] ? 0 : 1;
      updateState((prev) => ({
        ...prev,
        ap: {
          ...prev.ap,
          d: {
            ...prev.ap.d,
            [openDay]: {
              ...dayRecord,
              c: nextChecks,
            },
          },
        },
      }));
    };

    const handleCompleteDay = () => {
      if (dayRecord.c.some((x) => !x)) {
        toast('Tick every checklist item before completing the day.');
        return;
      }
      updateState(
        (prev) => ({
          ...prev,
          ap: {
            ...prev.ap,
            d: {
              ...prev.ap.d,
              [openDay]: {
                ...dayRecord,
                done: 1,
              },
            },
          },
        }),
        30,
        `· Day ${openDay} cleared!`
      );
    };

    const handleSaveSundayScore = () => {
      if (!sundayTarget) return;
      const num = Number(sundayScoreInput);
      if (sundayScoreInput === '' || isNaN(num) || num < 0 || num > sundayTarget[0]) {
        toast(`Enter a score between 0 and ${sundayTarget[0]}`);
        return;
      }
      updateState(
        (prev) => ({
          ...prev,
          ap: {
            ...prev.ap,
            d: {
              ...prev.ap.d,
              [openDay]: {
                ...dayRecord,
                ms: num,
                c: [1, 1, 1, 1, 1],
                done: 1,
              },
            },
          },
        }),
        25,
        '· Sunday test logged!'
      );
    };

    return (
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setOpenDay(null);
            }}
            className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Map / Calendar</span>
          </button>
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6]">
            Day {openDay} of 30
          </span>
        </div>

        {/* Title & Progress Bar */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
          <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">
            Day {openDay} · {topic}
          </h2>
          <div className="w-full h-3.5 bg-[#e3edff] dark:bg-[#1d2f6b] rounded-full overflow-hidden p-0.5 mt-3 mb-1">
            <div
              className="h-full bg-[#2fbf71] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-extrabold text-[#5a6685] dark:text-[#a5b1d6]">
            <span>{completionPercent}% completed</span>
            {dayRecord.done ? (
              <span className="text-[#2fbf71] font-black">Level Complete ✅</span>
            ) : (
              <span>{checkedCount}/5 tasks completed</span>
            )}
          </div>
        </div>

        {/* Compound Notes for topics */}
        {subTopics.length > 0 && (
          <div className="space-y-3">
            {subTopics.map((sub, idx) => {
              const note = NT[sub];
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3"
                >
                  <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">{sub}</h3>
                  <p className="text-sm font-bold leading-relaxed">{note[0]}</p>
                  <h4 className="text-sm font-lilita text-[#14275e] dark:text-[#ffc83d]">Key Rules & Formulas:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">
                    {note[1].map((f, fi) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                  <div className="bg-[#eef2fb] dark:bg-[#0b1330] p-3 rounded-xl border border-[#14275e]/20 text-xs font-bold">
                    <span className="text-[#4c7dff] font-extrabold uppercase block mb-1">Solved Example:</span>
                    {note[2]}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Curated Practical Quiz Questions (20 for regular days, 30 for Sunday Tests) */}
        {curatedQuestions.length > 0 && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-xl text-[#14275e] dark:text-[#ffc83d]">
                  {isSunday
                    ? `Day ${openDay} – ${topic} (${curatedQuestions.length} Questions Test)`
                    : `Day ${openDay} – ${topic}: 20 Practical Quiz Questions`}
                </h3>
                <span className="text-xs bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-0.5 rounded-full font-black">
                  {isSunday ? 'Comprehensive Sunday Assessment' : 'Interactive Practical Quiz · Beginner to Medium'}
                </span>
              </div>
              {curatedChecked[openDay] && (
                <span className="bg-[#2fbf71] text-[#06301a] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
                  Score:{' '}
                  {
                    curatedQuestions.filter(
                      (q, i) => (curatedAnswers[openDay] || {})[i] === q.correctIndex
                    ).length
                  }{' '}
                  / {curatedQuestions.length} Correct
                </span>
              )}
            </div>

            <div className="space-y-3.5">
              {curatedQuestions.map((q, qIndex) => {
                const picked = (curatedAnswers[openDay] || {})[qIndex];
                const isChecked = Boolean(curatedChecked[openDay]);
                const isCorrect = picked === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 space-y-2.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#0f1c3f] dark:text-[#eef2ff]">
                        Q{q.id}. {q.question}
                      </span>
                      {isChecked && (
                        <span className="text-base shrink-0">
                          {isCorrect ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const optLetter = ['A', 'B', 'C', 'D'][optIndex];
                        const isThisSelected = picked === optIndex;
                        const isThisCorrect = q.correctIndex === optIndex;

                        let optBtnStyle =
                          'bg-white dark:bg-[#14204a] text-[#0f1c3f] dark:text-[#eef2ff] hover:bg-gray-100 dark:hover:bg-[#1b2b63] border-[#14275e]/40';

                        if (isChecked) {
                          if (isThisCorrect) {
                            optBtnStyle =
                              'bg-[#dcf7e8] dark:bg-[#14402c] text-[#06301a] dark:text-green-200 border-green-600 font-black';
                          } else if (isThisSelected && !isCorrect) {
                            optBtnStyle =
                              'bg-[#f3e8ff] dark:bg-[#2e2255] text-red-600 border-red-500 line-through';
                          }
                        } else if (isThisSelected) {
                          optBtnStyle =
                            'bg-[#ffc83d] text-[#14275e] border-[#14275e] font-black shadow-[0_2px_0_#14275e]';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => {
                              if (isChecked) return;
                              setCuratedAnswers((prev) => ({
                                ...prev,
                                [openDay]: {
                                  ...(prev[openDay] || {}),
                                  [qIndex]: optIndex,
                                },
                              }));
                            }}
                            className={`p-2.5 rounded-xl border-2 text-left text-xs sm:text-sm font-bold transition flex items-center justify-between cursor-pointer ${optBtnStyle}`}
                          >
                            <span>
                              <span className="font-black mr-1.5">{optLetter})</span> {opt}
                            </span>
                            {isChecked && isThisCorrect && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if checked */}
                    {isChecked && (
                      <div className="mt-2 p-3 rounded-xl bg-[#fff3cc] dark:bg-[#4a3e12] border border-amber-300 dark:border-amber-700 text-xs text-[#14275e] dark:text-amber-100 space-y-1">
                        <div>
                          <span className="font-black">Answer:</span> {q.answerLabel}
                        </div>
                        <div>
                          <span className="font-black">Explanation:</span> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCheckCuratedPractice}
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-5 py-2.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                {curatedChecked[openDay] ? 'Re-check Answers' : 'Check 20 Answers (+XP)'}
              </button>
              {curatedChecked[openDay] && (
                <button
                  type="button"
                  onClick={() => {
                    setCuratedAnswers((prev) => ({ ...prev, [openDay]: {} }));
                    setCuratedChecked((prev) => ({ ...prev, [openDay]: false }));
                  }}
                  className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs transition cursor-pointer"
                >
                  Reset Answers
                </button>
              )}
            </div>
          </div>
        )}



        {/* Sunday Test Score Logger */}
        {isSunday && sundayTarget && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">
              Sunday Timed Test Score Tracker (Target: {sundayTarget[1]}/{sundayTarget[0]})
            </h3>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Solve the timed test set in your notebook or mock test portal and record your official score here.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={sundayTarget[0]}
                placeholder={`Score out of ${sundayTarget[0]}`}
                value={sundayScoreInput || dayRecord.ms || ''}
                onChange={(e) => setSundayScoreInput(e.target.value)}
                className="bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-bold text-sm w-44"
              />
              <button
                onClick={handleSaveSundayScore}
                className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                Save Score
              </button>
            </div>
            {dayRecord.ms !== undefined && (
              <div className="text-xs font-black">
                {Math.round((dayRecord.ms / sundayTarget[0]) * 100)}% ·{' '}
                {dayRecord.ms >= sundayTarget[1] ? (
                  <span className="text-green-600">🎯 Target Achieved!</span>
                ) : (
                  <span className="text-amber-500">📈 Needs more practice</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Revision Checklist */}
        {!isSunday && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">Daily Completion Checklist</h3>
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
        )}
      </div>
    );
  }

  // MAP & CALENDAR VIEW
  const weeks = [
    { title: 'Week 1 · Basic Mathematics', start: 1, end: 7 },
    { title: 'Week 2 · Arithmetic Aptitude', start: 8, end: 14 },
    { title: 'Week 3 · Work, Speed and Distance', start: 15, end: 21 },
    { title: 'Week 4 · Advanced Aptitude', start: 22, end: 28 },
    { title: 'Week 5 · Final Preparation', start: 29, end: 30 },
  ];

  const completedDaysCount = Object.values(aptitude.d).filter((d) => d.done).length;

  let missedDaysCount = 0;
  for (let n = 1; n <= Math.min(30, curDayNum - 1); n++) {
    if (!aptitude.d[n]?.done) missedDaysCount++;
  }

  return (
    <div className="space-y-4">
      {/* Top Banner with Today Status */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">Quantitative Aptitude Dashboard</h1>
            <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-bold mt-1">
              Day 1 unlocks on challenge start date. Each subsequent day unlocks on its scheduled day after checking in.
            </p>
          </div>
          <div>
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-3 border-[#14275e] rounded-xl px-4 py-2 font-black shadow-[0_3px_0_#14275e] active:translate-y-1 transition cursor-pointer text-xs sm:text-sm"
              >
                ⚔ Check In Aptitude (+10 XP)
              </button>
            ) : curDayNum >= 1 && curDayNum <= 30 ? (
              <button
                onClick={() => setOpenDay(curDayNum)}
                className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-3 border-[#14275e] rounded-xl px-4 py-2 font-black shadow-[0_3px_0_#14275e] active:translate-y-1 transition cursor-pointer text-xs sm:text-sm"
              >
                Start Day {curDayNum} Task ▶
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 30-Level Roadmap Cards */}
      <div className="space-y-4">
        <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">30-Day Aptitude Roadmap</h2>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="space-y-2">
            <h3 className="text-sm font-lilita text-[#5a6685] dark:text-[#a5b1d6] uppercase tracking-wider">
              {week.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Array.from({ length: week.end - week.start + 1 }, (_, i) => {
                const dayNum = week.start + i;
                const status = getDayStatus(dayNum);
                const st = statusLabels[status];
                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      if (status === 'lock') {
                        toast('🔒 This level stays locked until its scheduled date.');
                        return;
                      }
                      if (status === 'today') {
                        toast('Check in today above to unlock this task!');
                        return;
                      }
                      setOpenDay(dayNum);
                    }}
                    className={`text-left p-3 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer ${st.bg}`}
                  >
                    <div className="flex justify-between items-center text-xs font-black">
                      <span>Day {dayNum}</span>
                      <span className="text-[11px]">{st.badge}</span>
                    </div>
                    <div className="font-lilita text-sm sm:text-base text-[#14275e] dark:text-[#ffc83d] truncate mt-1">
                      {APS[dayNum - 1]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_3px_0_#14275e]">
          <div className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">Check-ins</div>
          <div className="text-xl font-black text-[#14275e] dark:text-white mt-0.5">{aptitude.ci.length}</div>
        </div>
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_3px_0_#14275e]">
          <div className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">Completed Days</div>
          <div className="text-xl font-black text-[#2fbf71] mt-0.5">{completedDaysCount} / 30</div>
        </div>
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_3px_0_#14275e]">
          <div className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">Missed Days</div>
          <div className="text-xl font-black text-[#ff5d6c] mt-0.5">{missedDaysCount}</div>
        </div>
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-3.5 shadow-[0_3px_0_#14275e]">
          <div className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">Streak / Best</div>
          <div className="text-xl font-black text-[#ffc83d] mt-0.5">
            {calcStreak(aptitude.ci, today)}d <span className="text-xs font-bold text-gray-400">({calcBestStreak(aptitude.ci)}d best)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
