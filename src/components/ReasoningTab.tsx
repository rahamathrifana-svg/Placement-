import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr, addDays } from '../utils/dateUtils.ts';
import {
  TOP,
  LEARN,
  CURATED_REASONING_PRACTICE,
  FINAL_REASONING_REVISION_QUESTIONS,
  NumberSystemPracticeQuestion,
} from '../data/placementData.ts';
import { ArrowLeft, CheckCircle2, Award, Clock, RotateCcw, Sparkles } from 'lucide-react';

export const ReasoningTab: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openFinalRevision, setOpenFinalRevision] = useState<boolean>(false);
  const [curatedAnswers, setCuratedAnswers] = useState<Record<number, Record<number, number>>>({});
  const [curatedChecked, setCuratedChecked] = useState<Record<number, boolean>>({});
  const [revisionAnswers, setRevisionAnswers] = useState<Record<number, number>>({});
  const [revisionChecked, setRevisionChecked] = useState<boolean>(false);
  const [testScoreInput, setTestScoreInput] = useState<string>('');

  const isStarted = Boolean(appState.start);
  const isCheckedIn = appState.checkins.includes(today);

  const getStatus = (dayNum: number) => {
    if (!appState.start) return 'lock';
    const scheduledDate = addDays(appState.start, dayNum - 1);
    if (scheduledDate > today) return 'lock';
    if (appState.lr[dayNum]?.done) return 'done';
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

  // Sunday and Mock test configs: [questions, target, minutes]
  const testConfigs: Record<number, [number, number, number]> = {
    7: [30, 24, 30],
    14: [30, 24, 35],
    21: [30, 24, 35],
    28: [30, 24, 40],
    30: [50, 40, 60],
  };

  if (!isStarted) {
    return (
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-6 shadow-[0_5px_0_#14275e]">
        <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d] mb-2">Logical Reasoning Quest</h2>
        <p className="text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6] mb-4">
          Start the 30-day challenge on the Home tab to unlock Day 1 of Logical Reasoning!
        </p>
        <button
          onClick={() => {
            updateState(
              (prev) => ({
                ...prev,
                start: today,
                checkins: [today],
              }),
              15,
              '· 30-Day Challenge Activated! Day 1 is ready.'
            );
          }}

          className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-3 border-[#14275e] rounded-xl px-5 py-2.5 font-black shadow-[0_4px_0_#14275e] transition cursor-pointer"
        >
          Start 30-Day Challenge Now
        </button>
      </div>
    );
  }

  // Calculate total completed questions for tracker
  const getSectionStats = () => {
    const isDayDone = (d: number) => Boolean(appState.lr[d]?.done);
    // Part 1: Days 1-7 (6*20 + 30 = 150)
    let s1 = 0;
    for (let d = 1; d <= 6; d++) if (isDayDone(d)) s1 += 20;
    if (isDayDone(7)) s1 += 30;

    // Part 2: Days 8-14 (6*20 + 30 = 150)
    let s2 = 0;
    for (let d = 8; d <= 13; d++) if (isDayDone(d)) s2 += 20;
    if (isDayDone(14)) s2 += 30;

    // Part 3: Days 15-21 (6*20 + 30 = 150)
    let s3 = 0;
    for (let d = 15; d <= 20; d++) if (isDayDone(d)) s3 += 20;
    if (isDayDone(21)) s3 += 30;

    // Part 4: Days 22-28 (6*20 + 30 = 150) -> in user prompt 170 including Sunday test
    let s4 = 0;
    for (let d = 22; d <= 27; d++) if (isDayDone(d)) s4 += 20;
    if (isDayDone(28)) s4 += 30;

    // Part 5: Days 29-30 (20 + 50 = 70)
    let s5 = 0;
    if (isDayDone(29)) s5 += 20;
    if (isDayDone(30)) s5 += 50;

    // Final revision
    const sRev = revisionChecked ? 50 : 0;

    const totalCovered = s1 + s2 + s3 + s4 + s5 + sRev;
    const totalGoal = 720;
    const pct = Math.round((totalCovered / totalGoal) * 100);

    return { s1, s2, s3, s4, s5, sRev, totalCovered, totalGoal, pct };
  };

  const stats = getSectionStats();

  // FINAL REVISION VIEW
  if (openFinalRevision) {
    const questions: NumberSystemPracticeQuestion[] = FINAL_REASONING_REVISION_QUESTIONS || [];
    const correctCount = questions.filter((q, i) => revisionAnswers[i] === q.correctIndex).length;

    const handleCheckRevision = () => {
      setRevisionChecked(true);
      updateState(
        (prev) => prev,
        correctCount * 2,
        `· Final Revision Score: ${correctCount}/${questions.length} (+${correctCount * 2} XP)`
      );
      toast(`Final Revision Evaluated! Score: ${correctCount} / ${questions.length} (+${correctCount * 2} XP)`);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpenFinalRevision(false)}
            className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Roadmap</span>
          </button>
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6] flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" /> Complete Syllabus Final Revision
          </span>
        </div>

        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">
                Final Revision: Complete Syllabus (50 Fresh Questions)
              </h2>
              <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-bold mt-1">
                Time limit: 60 minutes · Target score: 40/50 · Comprehensive questions covering all 30 days!
              </p>
            </div>
            {revisionChecked && (
              <span className="bg-[#2fbf71] text-[#06301a] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
                Score: {correctCount} / {questions.length} Correct ({Math.round((correctCount / questions.length) * 100)}%)
              </span>
            )}
          </div>
        </div>

        {/* Questions list */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const picked = revisionAnswers[idx];
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
                    {revisionChecked && (
                      <span className="text-base shrink-0">{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const optLetter = ['A', 'B', 'C', 'D'][optIdx];
                      const isThisSelected = picked === optIdx;
                      const isThisCorrect = q.correctIndex === optIdx;

                      let optBtnStyle =
                        'bg-white dark:bg-[#14204a] text-[#0f1c3f] dark:text-[#eef2ff] hover:bg-gray-100 dark:hover:bg-[#1b2b63] border-[#14275e]/40';

                      if (revisionChecked) {
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
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            if (revisionChecked) return;
                            setRevisionAnswers((prev) => ({ ...prev, [idx]: optIdx }));
                          }}
                          className={`p-2.5 rounded-xl border-2 text-left text-xs sm:text-sm font-bold transition flex items-center justify-between cursor-pointer ${optBtnStyle}`}
                        >
                          <span>
                            <span className="font-black mr-1.5">{optLetter})</span> {opt}
                          </span>
                          {revisionChecked && isThisCorrect && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {revisionChecked && (
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
              onClick={handleCheckRevision}
              className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-5 py-2.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
            >
              {revisionChecked ? 'Re-check Answers' : 'Submit Final Revision Test (+XP)'}
            </button>
            {revisionChecked && (
              <button
                type="button"
                onClick={() => {
                  setRevisionAnswers({});
                  setRevisionChecked(false);
                }}
                className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DAY DETAIL VIEW
  if (openDay !== null) {
    const topic = TOP[openDay - 1];
    const lesson = LEARN[openDay - 1];
    const dayRecord = appState.lr[openDay] || { c: [0, 0, 0, 0, 0], done: 0 };
    const testConfig = testConfigs[openDay];
    const isTestDay = Boolean(testConfig);

    const curatedQuestions: NumberSystemPracticeQuestion[] =
      CURATED_REASONING_PRACTICE[openDay] || [];

    const checklistItems = [
      'Learned the concept',
      'Understood rules and patterns',
      `Practiced ${curatedQuestions.length || 20} questions`,
      'Completed the practice quiz',
      'Revised incorrect answers',
    ];

    const dayAnswers = curatedAnswers[openDay] || {};
    const isChecked = Boolean(curatedChecked[openDay]);
    const correctCount = curatedQuestions.filter((q, idx) => dayAnswers[idx] === q.correctIndex).length;

    const handleCheckCurated = () => {
      if (!curatedQuestions.length) return;
      setCuratedChecked((prev) => ({ ...prev, [openDay]: true }));

      const nextChecks = [...dayRecord.c];
      nextChecks[1] = 1; // Understood rules
      nextChecks[2] = 1; // Practiced questions
      nextChecks[3] = 1; // Completed quiz
      nextChecks[4] = 1; // Revised answers

      const xpEarned = correctCount * (isTestDay ? 2 : 1);

      updateState(
        (prev) => ({
          ...prev,
          lr: {
            ...prev.lr,
            [openDay]: {
              ...dayRecord,
              c: nextChecks,
              pr: 1,
              ms: isTestDay ? Math.max(dayRecord.ms || 0, correctCount) : dayRecord.ms,
              done: isTestDay ? 1 : dayRecord.done,
            },
          },
        }),
        xpEarned,
        `· Day ${openDay} ${topic}: ${correctCount}/${curatedQuestions.length} correct`
      );

      toast(`Quiz Checked! Score: ${correctCount}/${curatedQuestions.length} (+${xpEarned} XP)`);
    };

    const handleChecklistToggle = (index: number) => {
      const nextChecks = [...dayRecord.c];
      nextChecks[index] = nextChecks[index] ? 0 : 1;
      updateState((prev) => ({
        ...prev,
        lr: {
          ...prev.lr,
          [openDay]: {
            ...dayRecord,
            c: nextChecks,
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
          lr: {
            ...prev.lr,
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

    const handleSaveTestScore = () => {
      if (!testConfig) return;
      const val = Number(testScoreInput);
      if (testScoreInput === '' || isNaN(val) || val < 0 || val > testConfig[0]) {
        toast(`Enter a score between 0 and ${testConfig[0]}`);
        return;
      }
      updateState(
        (prev) => ({
          ...prev,
          lr: {
            ...prev.lr,
            [openDay]: {
              ...dayRecord,
              ms: val,
              c: [1, 1, 1, 1, 1],
              done: 1,
            },
          },
        }),
        30,
        '· Test logged!'
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpenDay(null)}
            className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Map / Roadmap</span>
          </button>
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6]">
            Day {openDay} of 30
          </span>
        </div>

        {/* Lesson Overview Card */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">
              Day {openDay} · {topic}
            </h2>
            <span className="text-xs font-black bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-1 rounded-full">
              {curatedQuestions.length} Questions Bank
            </span>
          </div>

          {lesson ? (
            <>
              <p className="text-sm font-bold text-[#0f1c3f] dark:text-[#eef2ff] leading-relaxed">
                {lesson.title}
              </p>
              <h4 className="text-sm font-lilita text-[#14275e] dark:text-[#ffc83d] mt-2">Tips & Tricks:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6]">
                {lesson.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              {isTestDay
                ? `Timed test assessment: Solve all ${curatedQuestions.length} questions within ${testConfig?.[2] || 35} minutes. Target score: ${testConfig?.[1] || 24}/${testConfig?.[0] || 30}.`
                : 'Study the rules, solve the practical questions below, and review explanations and shortcuts.'}
            </p>
          )}
        </div>

        {/* Curated Interactive Question Bank */}
        {curatedQuestions.length > 0 && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-xl text-[#14275e] dark:text-[#ffc83d]">
                  {isTestDay
                    ? `${topic} · ${curatedQuestions.length} Questions Test`
                    : `Day ${openDay} – ${topic}: ${curatedQuestions.length} Practice Questions`}
                </h3>
                <span className="text-xs bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-0.5 rounded-full font-black">
                  IT Placement Preparation · 4 MCQ Options · Explanations & Shortcuts
                </span>
              </div>
              {isChecked && (
                <span className="bg-[#2fbf71] text-[#06301a] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm">
                  Score: {correctCount} / {curatedQuestions.length} Correct ({Math.round((correctCount / curatedQuestions.length) * 100)}%)
                </span>
              )}
            </div>

            <div className="space-y-3.5">
              {curatedQuestions.map((q, qIndex) => {
                const picked = dayAnswers[qIndex];
                const isOptionCorrect = picked === q.correctIndex;

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
                          {isOptionCorrect ? '✅' : '❌'}
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
                          } else if (isThisSelected && !isOptionCorrect) {
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
                onClick={handleCheckCurated}
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-5 py-2.5 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                {isChecked ? 'Re-check Answers' : `Check ${curatedQuestions.length} Answers (+XP)`}
              </button>
              {isChecked && (
                <button
                  type="button"
                  onClick={() => {
                    setCuratedAnswers((prev) => ({ ...prev, [openDay]: {} }));
                    setCuratedChecked((prev) => ({ ...prev, [openDay]: false }));
                  }}
                  className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timed Test Score Tracker */}
        {testConfig && (
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
            <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">
              {openDay === 30 ? 'Full Mock Test' : 'Sunday Test'} · {testConfig[0]} Questions ({testConfig[2]} min, target {testConfig[1]})
            </h3>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Check answers above or record an official test attempt score below.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={testConfig[0]}
                placeholder={`Score out of ${testConfig[0]}`}
                value={testScoreInput || dayRecord.ms || ''}
                onChange={(e) => setTestScoreInput(e.target.value)}
                className="bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-bold text-sm w-44"
              />
              <button
                onClick={handleSaveTestScore}
                className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                Save Score
              </button>
            </div>
            {dayRecord.ms !== undefined && (
              <div className="text-xs font-black">
                {Math.round((dayRecord.ms / testConfig[0]) * 100)}% ·{' '}
                {dayRecord.ms >= testConfig[1] ? (
                  <span className="text-green-600">🎯 Target Achieved!</span>
                ) : (
                  <span className="text-amber-500">📈 Needs Improvement</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Completion Checklist */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
          <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">Completion Checklist</h3>
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

  // WEEKS MAP & TRACKER VIEW
  const weeks = [
    { title: 'Week 1 · Basic Reasoning (Days 1–7)', start: 1, end: 7, questions: 150, topics: 'Series, coding, analogy, classification, blood relations and test 1' },
    { title: 'Week 2 · Arrangement & Relationships (Days 8–14)', start: 8, end: 14, questions: 150, topics: 'Directions, ranking, seating, syllogism, Venn diagrams and test 2' },
    { title: 'Week 3 · Critical & Analytical (Days 15–21)', start: 15, end: 21, questions: 150, topics: 'Statements, data sufficiency, puzzles, input/output and test 3' },
    { title: 'Week 4 · Non-Verbal & Visual (Days 22–28)', start: 22, end: 28, questions: 150, topics: 'Calendar, clocks, non-verbal, mirrors, paper folding, cubes and test 4' },
    { title: 'Week 5 · Final Prep (Days 29–30)', start: 29, end: 30, questions: 70, topics: 'Mixed practice (Day 29: 20 Qs) and full mock test (Day 30: 50 Qs)' },
  ];

  return (
    <div className="space-y-4">
      {/* 30-Level Roadmap Cards */}
      {weeks.map((w, wIdx) => (
        <div key={wIdx} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-lilita text-[#5a6685] dark:text-[#a5b1d6] uppercase tracking-wider">
              {w.title}
            </h3>
            <span className="text-xs font-black text-[#5a6685] dark:text-[#a5b1d6]">
              {w.questions} Questions
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {Array.from({ length: w.end - w.start + 1 }, (_, i) => {
              const dNum = w.start + i;
              const status = getStatus(dNum);
              const st = statusLabels[status];
              const qCount = dNum === 30 ? 50 : (dNum % 7 === 0 ? 30 : 20);
              return (
                <button
                  key={dNum}
                  onClick={() => {
                    if (status === 'lock') {
                      toast('🔒 This level unlocks on its scheduled date.');
                      return;
                    }
                    if (status === 'today') {
                      toast('Check in on Home to unlock today\'s task!');
                      return;
                    }
                    setOpenDay(dNum);
                  }}
                  className={`text-left p-3 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer ${st.bg}`}
                >
                  <div className="flex justify-between items-center text-xs font-black">
                    <span>Day {dNum}</span>
                    <span className="text-[11px]">{st.label}</span>
                  </div>
                  <div className="font-lilita text-sm sm:text-base text-[#14275e] dark:text-[#ffc83d] truncate mt-1">
                    {TOP[dNum - 1]}
                  </div>
                  <div className="text-[11px] font-bold text-[#5a6685] dark:text-[#a5b1d6] mt-0.5">
                    {qCount} Questions
                  </div>
                </button>
              );
            })}
            {wIdx === weeks.length - 1 && (
              <button
                onClick={() => setOpenFinalRevision(true)}
                className="text-left p-3 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] bg-[#fff3cc] dark:bg-[#4a3e12] shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs font-black text-amber-900 dark:text-amber-200">
                  <span>Revision</span>
                  <span className="text-[11px]">✨ 50 Qs</span>
                </div>
                <div className="font-lilita text-sm sm:text-base text-[#14275e] dark:text-[#ffc83d] truncate mt-1">
                  Final Revision
                </div>
                <div className="text-[11px] font-bold text-[#5a6685] dark:text-[#a5b1d6] mt-0.5">
                  Complete Syllabus Mock
                </div>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
