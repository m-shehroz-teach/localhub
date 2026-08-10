import React from 'react';
import { LayoutDashboard, Clock, ClipboardList, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recent', label: 'Recent Transfers', icon: Clock },
    { id: 'clipboard', label: 'Shared Clipboard', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#090c15] border-r border-[#161c2e]/60 flex flex-col justify-between p-6 flex-shrink-0">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mt-2">
          {/* Logo container */}
          <div className="w-8 h-8 rounded-lg bg-[#0e172a] border border-[#1e293b] flex items-center justify-center relative overflow-hidden">
            {/* Custom abstract icon representing LocalDrop P2P */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b2eb5]/30 to-[#7b80ff]/30 opacity-50"></div>
            <svg className="w-4 h-4 text-[#7b80ff] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LocalDrop</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#7b80ff] text-[#241e78] font-bold shadow-lg shadow-[#7b80ff]/10'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#161c2e]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="px-2 font-mono text-[10px] text-slate-500 space-y-1 mt-auto">
        <p className="text-slate-500 font-medium">Powered by LocalDrop P2P</p>
        <p className="text-[10px] text-slate-500/80">v1.2.4</p>
      </div>
    </aside>
  );
}
