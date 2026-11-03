import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#eef2fb] via-[#dce8ff] to-[#cfdfff] dark:from-[#0b1330] dark:via-[#14204a] dark:to-[#070c20]">
      <div className="w-full max-w-md bg-white dark:bg-[#14204a] border-3 border-[#14275e] dark:border-[#6f8cff] rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_#14275e] text-center space-y-6">
        {/* Logo */}
        <div className="w-20 h-20 bg-[#14275e] text-[#ffc83d] rounded-2xl flex items-center justify-center font-lilita text-4xl shadow-md mx-auto -rotate-3 border-2 border-[#ffc83d]">
          PQ
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl text-[#14275e] dark:text-[#ffc83d] flex items-center justify-center gap-1.5">
            <span>Placement Quest</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6685] dark:text-[#a5b1d6] font-extrabold mt-1.5">
            Gamified preparation for Aptitude, Logical Reasoning, Soft Skills, Certifications & Full-Stack Projects.
          </p>
        </div>


        {/* Google Sign-in Button */}
        <div>
          <button
            onClick={handleSignIn}
            disabled={signingIn || loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#1f1f1f] border-2 border-[#14275e] rounded-xl py-3 px-4 font-black shadow-[0_4px_0_#14275e] active:translate-y-1 active:shadow-none transition cursor-pointer disabled:opacity-50 text-sm sm:text-base"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M21.35 12.2c0-.64-.06-1.26-.16-1.85H12v3.51h5.24a4.48 4.48 0 0 1-1.94 2.94v2.4h3.15c1.84-1.69 2.9-4.18 2.9-7Z" />
              <path fill="#34A853" d="M12 21.75c2.62 0 4.82-.87 6.43-2.35l-3.15-2.4c-.87.58-1.98.93-3.28.93-2.52 0-4.66-1.7-5.42-3.99H3.33v2.47A9.4 9.4 0 0 0 12 21.75Z" />
              <path fill="#FBBC05" d="M6.58 13.94A5.65 5.65 0 0 1 6.28 12c0-.67.11-1.33.3-1.94V7.59H3.33A9.4 9.4 0 0 0 2.62 12c0 1.59.38 3.09 1.05 4.41l2.91-2.47Z" />
              <path fill="#EA4335" d="M12 6.07c1.43 0 2.7.49 3.71 1.45l2.79-2.79A9.04 9.04 0 0 0 12 2.25a9.4 9.4 0 0 0-8.67 5.34l3.25 2.47A5.72 5.72 0 0 1 12 6.07Z" />
            </svg>
            <span>{signingIn ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          {errorMsg && (
            <p className="text-xs font-bold text-red-500 mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
};
