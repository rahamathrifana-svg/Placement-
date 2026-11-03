import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { HeaderHUD } from './components/HeaderHUD.tsx';
import { HomeTab } from './components/HomeTab.tsx';
import { AptitudeTab } from './components/AptitudeTab.tsx';
import { ReasoningTab } from './components/ReasoningTab.tsx';
import { SoftSkillsTab } from './components/SoftSkillsTab.tsx';
import { CertificationsTab } from './components/CertificationsTab.tsx';
import { ProjectTab } from './components/ProjectTab.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';

type TabType = 'home' | 'ap' | 'lr' | 'ss' | 'cert' | 'proj';

const MainApp: React.FC = () => {
  const { user, loading, toastMessage } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('pq_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('pq_theme', theme);
    } catch (e) {}
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2fb] dark:bg-[#0b1330] text-[#14275e] dark:text-[#ffc83d]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#14275e] text-[#ffc83d] rounded-2xl flex items-center justify-center font-lilita text-3xl shadow-lg mx-auto animate-bounce border-2 border-[#ffc83d]">
            PQ
          </div>
          <p className="font-extrabold text-base">Loading Placement Quest...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: '🏠 Home' },
    { id: 'ap', label: '➗ Aptitude' },
    { id: 'lr', label: '🧠 Reasoning' },
    { id: 'ss', label: '🗣 Soft Skills' },
    { id: 'cert', label: '🎓 Certs' },
    { id: 'proj', label: '🛠 Project' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2fb] dark:bg-[#0b1330] text-[#0f1c3f] dark:text-[#eef2ff] transition-colors">
      <HeaderHUD theme={theme} setTheme={setTheme} />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <nav className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar mb-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-3 border-[#14275e] dark:border-[#6f8cff] shadow-[0_4px_0_#14275e] dark:shadow-[0_4px_0_#1d2f6b] active:translate-y-1 active:shadow-none transition cursor-pointer ${
                  isActive
                    ? 'bg-[#4c7dff] text-white shadow-none translate-y-0.5'
                    : 'bg-white dark:bg-[#14204a] text-[#0f1c3f] dark:text-[#eef2ff] hover:bg-gray-50 dark:hover:bg-[#1b2b63]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <main className="flex-1 pb-10">
          {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
          {activeTab === 'ap' && <AptitudeTab />}
          {activeTab === 'lr' && <ReasoningTab />}
          {activeTab === 'ss' && <SoftSkillsTab />}
          {activeTab === 'cert' && <CertificationsTab />}
          {activeTab === 'proj' && <ProjectTab />}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-50 bg-[#14275e] text-white px-5 py-2.5 rounded-2xl border-3 border-[#ffc83d] shadow-2xl font-black text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 max-w-[90vw] text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
