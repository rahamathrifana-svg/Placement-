import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { todayStr } from '../utils/dateUtils.ts';
import { PS, PG } from '../data/placementData.ts';
import { ArrowLeft, ExternalLink, Github, Copy, Edit3, Trash2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const ProjectTab: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const today = todayStr();

  const [openStepIndex, setOpenStepIndex] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormError, setProjectFormError] = useState<string>('');
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const handleResetProgress = () => {
    updateState(
      (prev) => ({
        ...prev,
        proj: {},
      }),
      0,
      '· Project step progress reset'
    );
    toast('Project step progress has been reset to 0/20.');
    setShowResetDialog(false);
  };

  const completedStepsCount = PS.filter((_, i) => appState.proj[i]?.s === 'Completed').length;
  const projectProgressPercent = completedStepsCount * 5;

  const currentEditingProject = (appState.pl || []).find((p) => p.id === editingProjectId);

  const handleSaveProjectLink = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('projName') as HTMLInputElement).value.trim();
    const live = (form.elements.namedItem('projLive') as HTMLInputElement).value.trim();
    const gh = (form.elements.namedItem('projGh') as HTMLInputElement).value.trim();

    if (!name) {
      setProjectFormError('Project name is required.');
      return;
    }
    if (live && !/^https?:\/\/\S+\.\S+/.test(live)) {
      setProjectFormError('Live URL must start with http:// or https://');
      return;
    }
    if (gh && !/^https?:\/\/\S+\.\S+/.test(gh)) {
      setProjectFormError('GitHub URL must start with http:// or https://');
      return;
    }

    const wasLive = currentEditingProject?.live;
    const isNew = !editingProjectId;

    updateState(
      (prev) => {
        const nextList = [...(prev.pl || [])];
        if (editingProjectId) {
          const idx = nextList.findIndex((p) => p.id === editingProjectId);
          if (idx >= 0) {
            nextList[idx] = { ...nextList[idx], name, live, gh };
          }
        } else {
          nextList.push({
            id: String(Date.now()),
            name,
            live,
            gh,
          });
        }
        return { ...prev, pl: nextList };
      },
      live && !wasLive ? 40 : isNew ? 10 : 0,
      live && !wasLive ? '· 🚀 Project is Live Deployed!' : '· Project portfolio updated!'
    );

    setEditingProjectId(null);
    setProjectFormError('');
    form.reset();
  };

  // STEP DETAIL VIEW
  if (openStepIndex !== null) {
    const step = PS[openStepIndex];
    const guide = PG[openStepIndex];
    const stepRecord = appState.proj[openStepIndex] || { s: 'Not Started' };
    const tasks = guide[1].split('|');
    const checkedTasks = stepRecord.g || [];

    const handleTaskToggle = (taskIndex: number) => {
      const nextChecked = [...checkedTasks];
      nextChecked[taskIndex] = nextChecked[taskIndex] ? 0 : 1;
      const nextStatus = stepRecord.s === 'Not Started' ? 'In Progress' : stepRecord.s;

      updateState((prev) => ({
        ...prev,
        proj: {
          ...prev.proj,
          [openStepIndex]: {
            ...stepRecord,
            s: nextStatus,
            g: nextChecked,
          },
        },
      }));
    };

    const handleMarkCompleted = () => {
      updateState(
        (prev) => ({
          ...prev,
          proj: {
            ...prev.proj,
            [openStepIndex]: {
              ...stepRecord,
              s: 'Completed',
              d: stepRecord.d || today,
            },
          },
        }),
        20,
        `· Step ${openStepIndex + 1} Cleared!`
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpenStepIndex(null)}
            className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All 20 Steps</span>
          </button>
          <span className="text-xs font-black uppercase text-[#5a6685] dark:text-[#a5b1d6]">
            Step {openStepIndex + 1} of 20
          </span>
        </div>

        {/* Step Header */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-[#4c7dff] text-white text-xs px-2.5 py-0.5 rounded-full font-black">
              {step[1]}
            </span>
            <span className="bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] text-xs px-2.5 py-0.5 rounded-full font-black">
              {checkedTasks.filter(Boolean).length}/{tasks.length} tasks completed
            </span>
          </div>
          <h2 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">
            Step {openStepIndex + 1} · {step[0]}
          </h2>
          <p className="text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6] mt-1">
            {guide[0]}
          </p>
        </div>

        {/* Step by step checklist */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
          <h3 className="text-lg text-[#14275e] dark:text-[#ffc83d]">Step-by-Step Learning Checklist</h3>
          <div className="space-y-2">
            {tasks.map((task, tIdx) => {
              const isChecked = Boolean(checkedTasks[tIdx]);
              return (
                <label
                  key={tIdx}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/15 cursor-pointer text-xs sm:text-sm font-bold"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTaskToggle(tIdx)}
                    className="w-4 h-4 mt-0.5 accent-[#2fbf71]"
                  />
                  <span className={isChecked ? 'line-through text-gray-400' : ''}>
                    {tIdx + 1}. {task}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Guide details */}
        <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3 text-xs sm:text-sm">
          <div>
            <h4 className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">What to Learn:</h4>
            <p className="font-bold text-[#5a6685] dark:text-[#a5b1d6]">{guide[2]}</p>
          </div>
          <div>
            <h4 className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">Practice Activity:</h4>
            <p className="font-bold text-[#5a6685] dark:text-[#a5b1d6]">{guide[3]}</p>
          </div>
          <div>
            <h4 className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">Completion Task:</h4>
            <p className="font-bold text-[#5a6685] dark:text-[#a5b1d6]">{guide[4]}</p>
          </div>
          <div>
            <h4 className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">Final Output:</h4>
            <p className="font-black text-[#2fbf71]">{guide[5]}</p>
          </div>

          {guide[6] && (
            <div>
              <h4 className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">Example / Template:</h4>
              <pre className="bg-[#eef2fb] dark:bg-[#0b1330] p-3 rounded-xl border border-[#14275e]/20 font-mono text-xs overflow-x-auto whitespace-pre-wrap mt-1">
                {guide[6]}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center gap-2">
          {openStepIndex > 0 ? (
            <button
              onClick={() => setOpenStepIndex(openStepIndex - 1)}
              className="bg-[#ffc83d] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleMarkCompleted}
            disabled={stepRecord.s === 'Completed'}
            className={`border-3 border-[#14275e] rounded-xl px-5 py-2.5 font-black text-xs sm:text-sm shadow-[0_4px_0_#14275e] active:translate-y-1 transition cursor-pointer flex items-center gap-2 ${
              stepRecord.s === 'Completed'
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{stepRecord.s === 'Completed' ? 'Completed ✅' : 'Mark as Completed (+20 XP)'}</span>
          </button>

          {openStepIndex < 19 ? (
            <button
              onClick={() => setOpenStepIndex(openStepIndex + 1)}
              className="bg-[#ffc83d] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition flex items-center gap-1 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  // ALL STEPS & PORTFOLIO VIEW
  return (
    <div className="space-y-4">
      {/* Roadmap Overview Card */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
          <h1 className="text-2xl text-[#14275e] dark:text-[#ffc83d]">Project Quest · 20 Steps</h1>
          <span className="text-xs sm:text-sm font-black text-[#5a6685] dark:text-[#a5b1d6]">
            {completedStepsCount} of 20 steps ({projectProgressPercent}%)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-bold mb-3">
          Build a real-world full-stack portfolio application (like Student Assignment Tracker) from problem identification to cloud deployment and interview defense.
        </p>

        <div className="w-full h-3.5 bg-[#e3edff] dark:bg-[#1d2f6b] rounded-full overflow-hidden p-0.5 mb-3">
          <div
            className="h-full bg-[#2fbf71] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${projectProgressPercent}%` }}
          />
        </div>

        {projectProgressPercent === 100 && (
          <div className="p-3 bg-[#dcf7e8] dark:bg-[#14402c] border-2 border-green-500 rounded-xl mb-3 text-xs font-black text-[#06301a] dark:text-green-200">
            🏆 Congratulations! You have completed all 20 steps. Your project is completely ready for placement interviews!
          </div>
        )}

        <button
          onClick={() => setShowResetDialog(true)}
          className="text-xs text-[#ff5d6c] hover:underline font-black cursor-pointer"
        >
          Reset Project Step Progress
        </button>
      </div>

      {/* Reset Confirmation In-App Modal */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-3xl p-6 max-w-sm w-full shadow-[0_8px_0_#14275e] text-center space-y-4">
            <h3 className="text-xl font-lilita text-[#14275e] dark:text-[#ffc83d]">
              Reset Project Step Progress?
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#5a6685] dark:text-[#a5b1d6]">
              This will reset all 20 project steps and task checklists back to 0%. Your added projects in "My Projects" will remain saved.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleResetProgress}
                className="bg-[#ff5d6c] hover:bg-[#ff4758] text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                Yes, Reset All Steps
              </button>
              <button
                onClick={() => setShowResetDialog(false)}
                className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Projects Card */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-3">
        <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">
          My Projects · {(appState.pl || []).filter((p) => p.live).length} Live
        </h2>
        <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
          A software project counts as completed when it has a publicly accessible live deployment URL.
        </p>

        <form onSubmit={handleSaveProjectLink} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
            <div>
              <label className="block mb-1">Project Name *</label>
              <input
                name="projName"
                defaultValue={currentEditingProject?.name || ''}
                placeholder="e.g. Student Task Manager"
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Live Project URL</label>
              <input
                name="projLive"
                defaultValue={currentEditingProject?.live || ''}
                placeholder="https://..."
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block mb-1">GitHub Repo URL</label>
              <input
                name="projGh"
                defaultValue={currentEditingProject?.gh || ''}
                placeholder="https://github.com/..."
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5"
              />
            </div>
          </div>

          {projectFormError && <p className="text-xs font-black text-red-500">{projectFormError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs sm:text-sm shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
            >
              {editingProjectId ? 'Save Changes' : '+ Add Project'}
            </button>
            {editingProjectId && (
              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectFormError('');
                }}
                className="bg-gray-200 dark:bg-gray-700 text-[#0f1c3f] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-1.5 font-black text-xs cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List of projects */}
        {(appState.pl || []).length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#14275e]/10">
            {(appState.pl || []).map((project) => (
              <div
                key={project.id}
                className="p-3 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 flex flex-wrap justify-between items-center gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">{project.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        project.live ? 'bg-[#dcf7e8] text-[#06301a]' : 'bg-[#fff3cc] text-[#14275e]'
                      }`}
                    >
                      {project.live ? '✅ Completed · Live' : '🛠 Building'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.live && (
                    <>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#2fbf71] text-[#06301a] border border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1"
                      >
                        <span>Open Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(project.live!).then(
                            () => toast('Link copied!'),
                            () => toast('Select link manually to copy.')
                          );
                        }}
                        className="bg-[#ffc83d] text-[#14275e] border border-[#14275e] rounded-lg px-2 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </>
                  )}
                  {project.gh && (
                    <a
                      href={project.gh}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1"
                    >
                      <Github className="w-3 h-3" />
                      <span>Repo</span>
                    </a>
                  )}
                  <button
                    onClick={() => setEditingProjectId(project.id)}
                    className="p-1 border border-[#14275e] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      updateState((prev) => ({
                        ...prev,
                        pl: (prev.pl || []).filter((p) => p.id !== project.id),
                      }));
                      toast(`Deleted project ${project.name}`);
                    }}
                    className="p-1 border border-[#14275e] rounded-lg hover:bg-red-100 text-red-600 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 20 Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PS.map((step, idx) => {
          const rec = appState.proj[idx] || { s: 'Not Started' };
          const isDone = rec.s === 'Completed';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_3px_0_#14275e] flex flex-col justify-between space-y-2 ${
                isDone ? 'bg-[#dcf7e8] dark:bg-[#14402c]' : 'bg-white dark:bg-[#14204a]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-xs font-black">
                  <span>Step {idx + 1}</span>
                  <span className="text-[10px] bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2 py-0.5 rounded-full">
                    {step[1]}
                  </span>
                </div>
                <div className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d] mt-1 leading-snug">
                  {step[0]}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-bold pt-1 border-t border-[#14275e]/10">
                <button
                  onClick={() => setOpenStepIndex(idx)}
                  className="w-full bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl py-1 font-black shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
                >
                  Open Guide
                </button>

                <select
                  value={rec.s}
                  onChange={(e) => {
                    const nextVal = e.target.value as 'Not Started' | 'In Progress' | 'Completed';
                    const wasCompleted = rec.s === 'Completed';
                    updateState(
                      (prev) => ({
                        ...prev,
                        proj: {
                          ...prev.proj,
                          [idx]: {
                            ...rec,
                            s: nextVal,
                            d: nextVal === 'Completed' ? rec.d || today : rec.d,
                          },
                        },
                      }),
                      nextVal === 'Completed' && !wasCompleted ? 20 : 0,
                      nextVal === 'Completed' && !wasCompleted ? `· Step ${idx + 1} cleared!` : undefined
                    );
                  }}
                  className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-lg px-2 py-1 font-bold"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <p className="text-[11px] text-[#5a6685] dark:text-[#a5b1d6] truncate font-bold">
                  Output: {PG[idx][5]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
