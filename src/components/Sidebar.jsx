import React from 'react';
import { LayoutDashboard, Clock, ClipboardList, Settings, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, onCloseSidebar }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recent', label: 'Recent Transfers', icon: Clock },
    { id: 'clipboard', label: 'Shared Clipboard', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-sidebar border-r border-border-card flex flex-col justify-between p-6 flex-shrink-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mt-2">
          <div className="flex items-center gap-3">
            {/* Logo container */}
            <div className="w-8 h-8 rounded-lg bg-bg-card border border-border-card flex items-center justify-center relative overflow-hidden">
              {/* Custom abstract icon representing LocalDrop P2P */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary/20 opacity-50"></div>
              <svg className="w-4 h-4 text-primary z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main">LocalDrop</span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseSidebar}
            className="md:hidden p-1.5 rounded-lg hover:bg-bg-card-inner/50 text-text-muted hover:text-text-main transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-primary-text font-bold shadow-lg shadow-primary/10'
                    : 'text-text-muted hover:text-text-main hover:bg-bg-card-inner/50'
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
      <div className="px-2 font-mono text-[10px] text-text-muted space-y-1 mt-auto">
        <p className="text-text-muted font-medium">Powered by LocalDrop P2P</p>
        <p className="text-[10px] text-text-muted/80">v1.2.4</p>
      </div>
    </aside>
  );
}
