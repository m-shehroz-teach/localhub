import React from 'react';
import { Menu } from 'lucide-react';

export default function HeaderBar({ isConnected, deviceName, onToggleSidebar }) {
  const currentHost = window.location.host;

  return (
    <header className="w-full flex items-center justify-between pb-6 flex-shrink-0 gap-4">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl bg-[#101622] border border-[#1e293b]/70 text-slate-300 hover:text-white hover:bg-[#161c2e]/50 focus:outline-none transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Local Host Tag */}
        <div className="hidden xs:block bg-[#101622] border border-[#1e293b]/70 px-4 py-1.5 rounded-full text-xs font-mono font-medium text-slate-300 truncate max-w-[150px] sm:max-w-none">
          IP: {currentHost}
        </div>

        {/* Status Pill */}
        {isConnected ? (
          <div className="bg-[#0b271d] border border-emerald-500/20 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            CONNECTED (WI-FI 5GHZ)
          </div>
        ) : (
          <div className="bg-[#241a12] border border-amber-500/20 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            WAITING FOR PEER
          </div>
        )}
      </div>

      {/* User Avatar Circle */}
      <button className="w-9 h-9 rounded-full bg-[#7b80ff]/10 hover:bg-[#7b80ff]/20 border border-[#7b80ff]/20 flex items-center justify-center text-[#7b80ff] transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </header>
  );
}
