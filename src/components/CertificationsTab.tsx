import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { PL, PR, LIC } from '../data/placementData.ts';
import { CertificationItem } from '../types/index.ts';
import { ExternalLink, Star, Download, Edit3, Trash2, Copy, FileText, Check, PlusCircle, Printer } from 'lucide-react';

export const CertificationsTab: React.FC = () => {
  const { appState, updateState, toast } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [attachedPdf, setAttachedPdf] = useState<{ name: string; data: string } | null>(null);
  const [formError, setFormError] = useState('');
  const [activeLinkedInCertId, setActiveLinkedInCertId] = useState<string | null>(null);

  // Filtered platforms
  const filteredPlatforms = PL.filter(
    (p) =>
      p[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p[2].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCerts = appState.certs.filter((c) => c.steps?.[4]).length;
  const certCompletionPercent = appState.certs.length
    ? Math.round((completedCerts / appState.certs.length) * 100)
    : 0;

  const handleBookmark = (platformName: string) => {
    const isBookmarked = appState.marks.includes(platformName);
    updateState((prev) => ({
      ...prev,
      marks: isBookmarked
        ? prev.marks.filter((m) => m !== platformName)
        : [...prev.marks, platformName],
    }));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) {
      setFormError('Only PDF files are supported.');
      return;
    }
    if (file.size > 1500000) {
      setFormError('PDF file must be under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedPdf({ name: file.name, data: reader.result as string });
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const plat = (form.elements.namedItem('plat') as HTMLInputElement).value.trim();
    const start = (form.elements.namedItem('start') as HTMLInputElement).value.trim();
    const end = (form.elements.namedItem('end') as HTMLInputElement).value.trim();
    const link = (form.elements.namedItem('link') as HTMLInputElement).value.trim();
    const skills = (form.elements.namedItem('skills') as HTMLInputElement).value.trim();
    const curl = (form.elements.namedItem('curl') as HTMLInputElement).value.trim();

    if (!name || !plat) {
      setFormError('Course name and platform are required.');
      return;
    }
    if (link && !/^https?:\/\/\S+\.\S+/.test(link)) {
      setFormError('Certificate link must start with http:// or https://');
      return;
    }
    if (curl && !/^https?:\/\/\S+\.\S+/.test(curl)) {
      setFormError('Course link must start with http:// or https://');
      return;
    }

    const id = editingCert?.id || String(Date.now());
    const isDuplicate = appState.certs.some(
      (c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase() && c.plat.toLowerCase() === plat.toLowerCase()
    );
    if (isDuplicate) {
      setFormError('This certification is already in your tracker.');
      return;
    }

    const newRecord: CertificationItem = {
      id,
      name,
      plat,
      start,
      end,
      link,
      skills,
      curl,
      file: attachedPdf || editingCert?.file || null,
      steps: editingCert?.steps || [0, 0, 0, 0, 0, 0],
    };

    updateState(
      (prev) => {
        const existingIndex = prev.certs.findIndex((c) => c.id === id);
        let nextCerts = [...prev.certs];
        if (existingIndex >= 0) {
          nextCerts[existingIndex] = newRecord;
        } else {
          nextCerts.push(newRecord);
        }
        return {
          ...prev,
          certs: nextCerts,
        };
      },
      5,
      '· Certification updated!'
    );

    setEditingCert(null);
    setAttachedPdf(null);
    setFormError('');
    form.reset();
  };

  const handleStepToggle = (certId: string, stepIndex: number) => {
    const cert = appState.certs.find((c) => c.id === certId);
    if (!cert) return;
    const wasEarned = cert.steps?.[4] === 1;
    const nextSteps = [...(cert.steps || [0, 0, 0, 0, 0, 0])];
    nextSteps[stepIndex] = nextSteps[stepIndex] ? 0 : 1;
    const nowEarned = nextSteps[4] === 1;

    updateState(
      (prev) => ({
        ...prev,
        certs: prev.certs.map((c) => (c.id === certId ? { ...c, steps: nextSteps } : c)),
      }),
      !wasEarned && nowEarned ? 50 : 0,
      !wasEarned && nowEarned ? '· 🎓 Certificate Earned!' : undefined
    );

    if (!wasEarned && nowEarned) {
      toast('🎉 Congratulations on completing the course! Update LinkedIn & resume.');
    }
  };

  const handleDownloadPdf = (file: { name: string; data: string }) => {
    const base64Data = file.data.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Name', 'Platform', 'Start Date', 'Completion Date', 'Certificate URL', 'Skills', 'Completed Steps'],
      ...appState.certs.map((c) => [
        c.name,
        c.plat,
        c.start || '',
        c.end || '',
        c.link || '',
        c.skills || '',
        `${(c.steps || []).filter(Boolean).length}/6`,
      ]),
    ];
    const csvContent = rows
      .map((r) => r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placement-quest-certifications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeCertForLinkedIn = appState.certs.find((c) => c.id === activeLinkedInCertId);
  const linkedInState = activeLinkedInCertId
    ? appState.li[activeLinkedInCertId] || { c: [0, 0, 0, 0, 0, 0, 0, 0, 0], done: 0 }
    : null;

  return (
    <div className="space-y-4">
      {/* Free Learning Platforms Directory */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <div>
            <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">Official Free Learning Platforms</h2>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              Explore reputable courses from Google, IBM, Microsoft, Cisco, AWS, and freeCodeCamp.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search platform or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-bold text-xs w-full sm:w-64"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlatforms.map((p, idx) => {
            const isBookmarked = appState.marks.includes(p[0]);
            return (
              <div
                key={idx}
                className="bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/20 rounded-xl p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-lilita text-base text-[#14275e] dark:text-[#ffc83d]">{p[0]}</span>
                    <button
                      onClick={() => handleBookmark(p[0])}
                      className="text-amber-400 hover:text-amber-500 transition cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold mt-1">{p[2]}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#14275e]/10">
                  <a
                    href={p[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition flex items-center gap-1"
                  >
                    <span>Start Learning</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => {
                      setEditingCert({
                        plat: p[0],
                        curl: p[1],
                        name: '',
                      });
                      document.getElementById('certForm')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-lg px-2 py-1 text-xs font-black shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
                  >
                    + Add to Tracker
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Certification Form */}
      <div
        id="certForm"
        className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e]"
      >
        <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d] mb-3">
          {editingCert?.id ? 'Edit Certification' : 'Add Certification to Tracker'}
        </h2>

        <form onSubmit={handleSaveCert} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            <div>
              <label className="block mb-1">Course Name *</label>
              <input
                name="name"
                defaultValue={editingCert?.name || ''}
                placeholder="e.g. Google Cloud Computing Foundations"
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Platform *</label>
              <input
                name="plat"
                defaultValue={editingCert?.plat || ''}
                placeholder="e.g. Google Cloud Skills Boost"
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                name="start"
                defaultValue={editingCert?.start || ''}
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Completion Date</label>
              <input
                type="date"
                name="end"
                defaultValue={editingCert?.end || ''}
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Certificate Public URL</label>
              <input
                name="link"
                defaultValue={editingCert?.link || ''}
                placeholder="https://..."
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Certificate PDF (under 1.5MB)</label>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handlePdfUpload}
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-1.5 text-xs"
              />
              <span className="text-[11px] text-[#5a6685] dark:text-[#a5b1d6] mt-0.5 block">
                {attachedPdf
                  ? `Attached: ${attachedPdf.name}`
                  : editingCert?.file
                  ? `Current: ${editingCert.file.name}`
                  : 'Upload your verified certificate PDF.'}
              </span>
            </div>
            <div>
              <label className="block mb-1">Skills Learned (Comma separated)</label>
              <input
                name="skills"
                defaultValue={editingCert?.skills || ''}
                placeholder="Cloud Infrastructure, IAM, BigQuery"
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Free Course Link</label>
              <input
                name="curl"
                defaultValue={editingCert?.curl || ''}
                placeholder="https://..."
                className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {formError && <p className="text-xs font-black text-red-500">{formError}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
            >
              {editingCert?.id ? 'Save Changes' : '+ Add Certification (+5 XP)'}
            </button>
            {editingCert && (
              <button
                type="button"
                onClick={() => {
                  setEditingCert(null);
                  setAttachedPdf(null);
                  setFormError('');
                }}
                className="bg-gray-200 dark:bg-gray-700 text-[#0f1c3f] dark:text-white border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* My Certifications List */}
      <div className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">
              My Certifications · {certCompletionPercent}% Complete
            </h2>
            <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
              {completedCerts} of {appState.certs.length} certificates earned
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCsv}
              className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-200 dark:bg-gray-700 text-[#14275e] dark:text-white border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {appState.certs.length === 0 ? (
          <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold py-4 text-center">
            No certifications added yet. Select a platform above to start tracking!
          </p>
        ) : (
          <div className="space-y-4">
            {appState.certs.map((cert) => {
              const completedStepCount = (cert.steps || []).filter(Boolean).length;
              const stepPercent = Math.round((completedStepCount / 6) * 100);

              return (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e]/30 space-y-3"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-lilita text-lg text-[#14275e] dark:text-[#ffc83d]">{cert.name}</span>
                        <span className="text-[11px] font-black bg-[#e3edff] dark:bg-[#1d2f6b] text-[#14275e] dark:text-[#6f8cff] px-2.5 py-0.5 rounded-full">
                          {completedStepCount}/6 steps ({stepPercent}%)
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#5a6685] dark:text-[#a5b1d6]">
                        {cert.plat} {cert.skills ? `· Skills: ${cert.skills}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cert.curl && (
                        <a
                          href={cert.curl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#2fbf71] text-[#06301a] border border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1"
                        >
                          <span>Course</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#ffc83d] text-[#14275e] border border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1"
                        >
                          <span>Verify Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {cert.file && (
                        <button
                          onClick={() => handleDownloadPdf(cert.file!)}
                          className="bg-[#4c7dff] text-white border border-[#14275e] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_2px_0_#14275e] flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingCert(cert);
                          document.getElementById('certForm')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-1.5 border border-[#14275e] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          updateState((prev) => ({
                            ...prev,
                            certs: prev.certs.filter((c) => c.id !== cert.id),
                          }));
                          toast(`Deleted ${cert.name}`);
                        }}
                        className="p-1.5 border border-[#14275e] rounded-lg hover:bg-red-100 text-red-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 6-step roadmap checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-[#14275e]/10">
                    {PR.map((stepLabel, sIdx) => {
                      const isDone = cert.steps?.[sIdx] === 1;
                      return (
                        <label
                          key={sIdx}
                          className="flex items-center gap-2 text-xs font-bold p-1.5 rounded-lg bg-white dark:bg-[#14204a] border border-[#14275e]/15 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => handleStepToggle(cert.id, sIdx)}
                            className="w-3.5 h-3.5 accent-[#2fbf71]"
                          />
                          <span className={isDone ? 'line-through text-gray-400' : ''}>
                            {sIdx + 1}. {stepLabel}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {cert.steps?.[4] === 1 && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActiveLinkedInCertId(cert.id);
                          document.getElementById('linkedInSection')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-[#ffc83d] hover:bg-[#ffbe1a] text-[#14275e] border-2 border-[#14275e] rounded-xl px-3 py-1.5 font-black text-xs shadow-[0_2px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
                      >
                        🚀 Prepare LinkedIn Update Post
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LinkedIn Announcement & Profile Checklist */}
      {activeCertForLinkedIn && linkedInState && (
        <div
          id="linkedInSection"
          className="bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-2xl p-5 shadow-[0_5px_0_#14275e] space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-[#14275e] dark:text-[#ffc83d]">
              LinkedIn Announcement · {activeCertForLinkedIn.name}
            </h2>
            <button
              onClick={() => setActiveLinkedInCertId(null)}
              className="text-xs text-[#5a6685] hover:underline font-bold cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-[#5a6685] dark:text-[#a5b1d6] font-bold">
            Copy this tailored text and paste it directly into your LinkedIn post to showcase your accomplishments to recruiters.
          </p>

          <textarea
            id="linkedInPostText"
            rows={7}
            readOnly
            value={`I am thrilled to share that I have successfully completed ${activeCertForLinkedIn.name} from ${activeCertForLinkedIn.plat}!\n\nDuring this course, I gained hands-on practical skills in ${
              activeCertForLinkedIn.skills || 'core computer science and placement topics'
            }.\n\nThis certification has strengthened my technical foundations, and I look forward to applying these skills in upcoming projects and professional opportunities.\n\n#PlacementPrep #Learning #Certification #SoftwareEngineering #CareerGrowth`}
            className="w-full bg-[#eef2fb] dark:bg-[#0b1330] border-2 border-[#14275e] rounded-xl p-3 text-xs sm:text-sm font-bold font-mono"
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('linkedInPostText') as HTMLTextAreaElement;
                if (el) {
                  navigator.clipboard.writeText(el.value).then(
                    () => toast('Post announcement copied to clipboard!'),
                    () => toast('Manual copy: select text and press Ctrl+C.')
                  );
                }
              }}
              className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Post Text</span>
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#14275e]/15">
            <h3 className="text-sm font-lilita text-[#14275e] dark:text-[#ffc83d]">
              LinkedIn Profile Checklist
            </h3>
            {LIC.map((task, lIdx) => {
              const isChecked = Boolean(linkedInState.c[lIdx]);
              return (
                <label
                  key={lIdx}
                  className="flex items-center gap-2 text-xs font-bold p-1.5 rounded-lg bg-[#eef2fb] dark:bg-[#0b1330] border border-[#14275e]/15 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const nextChecks = [...linkedInState.c];
                      nextChecks[lIdx] = nextChecks[lIdx] ? 0 : 1;
                      updateState((prev) => ({
                        ...prev,
                        li: {
                          ...prev.li,
                          [activeCertForLinkedIn.id]: {
                            ...linkedInState,
                            c: nextChecks,
                          },
                        },
                      }));
                    }}
                    className="w-3.5 h-3.5 accent-[#2fbf71]"
                  />
                  <span>{task}</span>
                </label>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => {
                  if (LIC.some((_, i) => !linkedInState.c[i])) {
                    toast('Tick every item on the LinkedIn checklist first.');
                    return;
                  }
                  if (!linkedInState.done) {
                    updateState(
                      (prev) => ({
                        ...prev,
                        li: {
                          ...prev.li,
                          [activeCertForLinkedIn.id]: {
                            ...linkedInState,
                            done: 1,
                          },
                        },
                      }),
                      25,
                      '· LinkedIn update complete!'
                    );
                  }
                  toast('Great work! Your certification and LinkedIn profile are up-to-date.');
                }}
                className="bg-[#2fbf71] hover:bg-[#28a964] text-[#06301a] border-2 border-[#14275e] rounded-xl px-4 py-2 font-black text-xs sm:text-sm shadow-[0_3px_0_#14275e] active:translate-y-0.5 transition cursor-pointer"
              >
                Mark LinkedIn Update Completed (+25 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
