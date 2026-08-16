import React, { useState, useEffect } from 'react';
import { 
  Trash2, Copy, Check, Link, FileText, Code2, 
  Eye, EyeOff, ShieldAlert, Key, Globe
} from 'lucide-react';
import AdSense from '../AdSense';
export default function SharedClipboardView({
  clipboardText,
  clipboardHistory = [],
  onSyncClipboard,
  onClearHistory,
}) {
  const [textInput, setTextInput] = useState(clipboardText);
  const [copied, setCopied] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [sensitiveMode, setSensitiveMode] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState(false);

  // Keep local input in sync with external updates
  useEffect(() => {
    setTextInput(clipboardText);
  }, [clipboardText]);

  const handleSync = () => {
    onSyncClipboard(textInput);
    setSyncedStatus(true);
    setTimeout(() => setSyncedStatus(false), 2000);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHistory = clipboardHistory;

  // Simple language detection
  const getLanguage = (text) => {
    if (text.includes('function') || text.includes('const ') || text.includes('let ')) return 'JAVASCRIPT';
    if (text.includes('<html>') || text.includes('<div>')) return 'HTML';
    if (text.includes('import ') && text.includes('from ')) return 'JAVASCRIPT';
    return 'TEXT';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Shared Clipboard</h2>
          <p className="text-sm text-slate-400 mt-1">
            Instantly sync text, code snippets, and links across your connected peers. End-to-end encrypted.
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="px-4 py-2.5 rounded-xl bg-[#0c0f1d] border border-border-card hover:bg-rose-950/20 hover:border-rose-800/40 hover:text-rose-400 text-slate-400 text-xs font-semibold flex items-center gap-2 transition-colors self-start"
        >
          <Trash2 className="w-3.5 h-3.5" /> 
          Clear History
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-6">
        
        {/* LEFT COLUMN: Current Clipboard and Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-6 space-y-5">
            
            {/* Editor Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-bold text-white">Current Clipboard</span>
              </div>

              {/* Switches Container */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                
                 {/* Auto Sync Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <span className="text-xs text-slate-400 font-semibold">Auto-sync</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={autoSync} 
                      onChange={() => setAutoSync(!autoSync)} 
                      className="sr-only" 
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${autoSync ? 'bg-[var(--text-textarea)]/20 border border-[var(--text-textarea)]/30' : 'bg-bg-app border border-border-card'}`}></div>
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform ${autoSync ? 'translate-x-4 bg-[var(--text-textarea)]' : 'bg-slate-500'}`}></div>
                  </div>
                </label>
 
                 {/* Sensitive Mode Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <span className="text-xs text-slate-400 font-semibold">Sensitive Mode</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={sensitiveMode} 
                      onChange={() => setSensitiveMode(!sensitiveMode)} 
                      className="sr-only" 
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${sensitiveMode ? 'bg-primary-light border border-primary-border' : 'bg-bg-app border border-border-card'}`}></div>
                    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform ${sensitiveMode ? 'translate-x-4 bg-primary' : 'bg-slate-500'}`}></div>
                  </div>
                </label>
 
                 {/* Code icon */}
                <div className="p-1.5 bg-primary-light rounded-lg border border-primary-border text-primary">
                  <Code2 className="w-3.5 h-3.5" />
                </div>

              </div>
            </div>

            {/* Textarea Code Container */}
            <div className="relative">
              <textarea
                rows={12}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste or write text to broadcast live..."
                className="w-full bg-[#080b13] border border-border-card rounded-2xl p-5 text-xs font-mono text-text-textarea placeholder-slate-600 focus:outline-none focus:border-primary/40 resize-none leading-relaxed"
              />
            </div>

            {/* Bottom Editor Info Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold text-text-muted bg-bg-card-inner border border-border-card px-3 py-1.5 rounded-lg">
                  {textInput.length} CHARS
                </span>
                <span className="text-[10px] font-mono font-bold text-primary bg-primary-light border border-primary-border px-3 py-1.5 rounded-lg">
                  {getLanguage(textInput)}
                </span>
              </div>

              <button
                onClick={handleSync}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-text text-xs font-bold transition-all shadow-md shadow-primary/10 flex items-center gap-2"
              >
                <svg className={`w-3.5 h-3.5 ${syncedStatus ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                </svg>
                Sync to Peers
              </button>
            </div>

          </div>

          {/* Network Sync Status Box */}
          <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">NETWORK SYNC STATUS</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-400">All Synced</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sync History Feed */}
        <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Sync History</h3>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-[#161d2f] px-2.5 py-1 rounded-lg">Last 24h</span>
          </div>

          <div className="space-y-3">
            {displayHistory.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#080b13] border border-[#1f2940]/60 rounded-2xl p-4 space-y-3 hover:border-[#2e3b5e]/60 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    {item.type === 'URL' && <Link className="w-3.5 h-3.5 text-indigo-400" />}
                    {item.type === 'Snippet' && <Code2 className="w-3.5 h-3.5 text-indigo-400" />}
                    {item.type === 'Secret' && <Key className="w-3.5 h-3.5 text-[#e0b034]" />}
                    {item.type === 'Text' && <FileText className="w-3.5 h-3.5 text-slate-400" />}
                    {item.type} • {item.time}
                  </span>
                  
                  {item.sensitive && (
                    <EyeOff className="w-3.5 h-3.5 text-[#e0b034]" />
                  )}
                </div>

                {item.sensitive ? (
                  <p className="text-xs font-mono text-slate-600 tracking-widest blur-[3px] select-none">
                    ••••••••••••••••••••••••••••••••
                  </p>
                ) : (
                  <p className="text-xs font-mono text-slate-300 break-all line-clamp-3">
                    {item.content}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#1d263b]/30">
                  <span className="text-[9px] font-mono text-slate-500 bg-[#0e1322] px-2 py-0.5 rounded border border-[#2e3b5e]/25">
                    From: {item.from}
                  </span>
                  <button
                    onClick={() => handleCopy(item.content)}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" /> 
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full text-center py-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider pt-2">
            Load Older Entries
          </button>
        </div>

      </div>

      {/* Advertisement Unit */}
      <AdSense slot="8015104816" />

    </div>
  );
}