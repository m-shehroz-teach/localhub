import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Upload, Copy, Check, ArrowUpRight, ArrowDownLeft, 
  FileText, QrCode, X, Laptop, Smartphone, Link
} from 'lucide-react';

export default function DashboardView({
  activeTransfer,
  filesHistory = [],
  onFilesSelected,
  isConnected,
  roomKey,
  deviceName,
  peerDeviceName,
}) {
  const [copied, setCopied] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('qr'); // 'qr' or 'key'
  const [clipboardInput, setClipboardInput] = useState('');
  const [clipboardCopied, setClipboardCopied] = useState(false);

  // Live generated connection link
  const shareableUrl = `${window.location.origin}/?room=${roomKey}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyClipboardInput = () => {
    if (!clipboardInput.trim()) return;
    navigator.clipboard.writeText(clipboardInput);
    setClipboardCopied(true);
    setTimeout(() => setClipboardCopied(false), 2000);
  };

  // Helper to get file icons
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    );
  };

  const displayHistory = filesHistory;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start pb-6">
      
      {/* LEFT COLUMN: Main dropzone, active transfers, shared history */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* File Drag and Drop Zone */}
        <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-6 relative">
          <div className="border border-dashed border-[#242f4c] hover:border-[#7b80ff]/50 rounded-2xl p-12 transition-all bg-[#080b13]/40 flex flex-col items-center justify-center relative min-h-[300px]">
            <input
              type="file"
              onChange={(e) => onFilesSelected(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {/* Upload cloud icon */}
            <div className="w-16 h-16 rounded-full bg-[#111625] flex items-center justify-center border border-[#1e293b]/60 text-slate-300 mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-white tracking-tight">Drag & drop files here</h3>
            <p className="text-sm text-slate-400 mt-2">or click to browse from device</p>
            
            <button className="mt-6 px-6 py-2.5 rounded-full bg-[#7b80ff] hover:bg-[#6c71f0] text-[#1a1754] text-xs font-bold transition-all shadow-md shadow-[#7b80ff]/10">
              Select Files
            </button>
          </div>
        </div>

        {/* Active Transfer Progress Container */}
        {activeTransfer && (
          <div className="bg-[#0c0f1d] border border-[#1d263b]/60 rounded-3xl p-6 relative">
            <button className="absolute top-4 right-4 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4">
              {getFileIcon(activeTransfer.fileName)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-white truncate max-w-md">{activeTransfer.fileName}</h4>
                  <span className="text-[10px] bg-[#1a2035] text-slate-300 font-mono px-2 py-0.5 rounded border border-[#2e3b5e]/40">
                    {activeTransfer.fileSize}
                  </span>
                  <span className="text-[10px] bg-[#162a35] text-[#3dd1ff] font-mono px-2 py-0.5 rounded border border-[#1b3d4f]/40 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#3dd1ff]"></span>
                    {activeTransfer.speed || '0 MB/s'}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
                  <span>{activeTransfer.progress}% completed</span>
                  <span>{activeTransfer.timeRemaining || '2s remaining'}</span>
                </div>
                
                {/* Custom Gradient Progress Bar */}
                <div className="w-full bg-[#161d30] rounded-full h-2 mt-2 overflow-hidden border border-[#242f4c]/30">
                  <div
                    className="bg-gradient-to-r from-[#7b80ff] to-[#3df5c2] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${activeTransfer.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Items List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white px-1">Shared Items <span className="text-slate-400 font-normal">({displayHistory.length})</span></h3>
          <div className="space-y-3">
            {displayHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#0c0f1d] border border-[#1d263b]/50 rounded-2xl hover:border-[#2e3b5e]/60 transition-colors">
                <div className="flex items-center gap-4">
                  {getFileIcon(item.name)}
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {item.size} <span className="mx-1">•</span> {item.type}
                    </p>
                  </div>
                </div>

                <div>
                  {item.status === 'Sent' || item.type === 'Sent' ? (
                    <div className="w-8 h-8 rounded-full bg-[#0d2a20] border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <a
                      href={item.url || '#'}
                      download={item.name}
                      onClick={(e) => { if(!item.url) e.preventDefault(); }}
                      className="w-8 h-8 rounded-full bg-[#1b2237] hover:bg-[#252f4c] border border-[#2e3b5e]/40 flex items-center justify-center text-slate-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Connection controls, clipboard snippet, peer state */}
      <div className="space-y-6">
        
        {/* Connect Devices Pane */}
        <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Connect Devices on Local Wi-Fi</h3>
            <p className="text-xs text-slate-400 mt-1">Choose how you want to connect your devices</p>
          </div>

          {/* Toggle buttons */}
          <div className="flex bg-[#080b13] p-1 rounded-xl border border-[#222d47]/30">
            <button 
              onClick={() => setActiveRightTab('qr')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRightTab === 'qr' 
                  ? 'bg-[#7b80ff]/15 text-[#7b80ff] border border-[#7b80ff]/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Scan QR
            </button>
            <button 
              onClick={() => setActiveRightTab('key')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeRightTab === 'key' 
                  ? 'bg-[#7b80ff]/15 text-[#7b80ff] border border-[#7b80ff]/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-3.5 h-3.5 border border-current rounded flex items-center justify-center text-[8px] font-bold">K</span>
              Unique Key
            </button>
          </div>

          {/* Inner Content Area */}
          <div className="flex flex-col items-center justify-center py-2">
            {activeRightTab === 'qr' ? (
              <div className="space-y-4 w-full flex flex-col items-center">
                {/* QR Code Container with nice framing */}
                <div className="relative p-6 bg-[#080b13] border border-[#242f4c] rounded-2xl">
                  {/* Decorative corner highlights */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br-sm"></div>
                  
                  <div className="bg-white p-3 rounded-lg flex items-center justify-center">
                    <QRCodeSVG value={shareableUrl} size={130} level="M" fgColor="#080b13" />
                  </div>
                </div>
                
                <p className="text-xs text-slate-400 text-center max-w-[200px] leading-relaxed">
                  Scan with your phone camera to pair over local Wi-Fi.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4 px-2 py-4 text-center">
                <div className="bg-[#080b13] border border-[#242f4c] py-4 rounded-2xl">
                  <span className="font-mono text-xl font-bold tracking-widest text-[#7b80ff]">{roomKey}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px] mx-auto">
                  Enter this room key on your peer's browser to pair instantly.
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#2e3b5e]/80 hover:bg-[#182035] text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied!' : 'Copy Share Link'}
          </button>
        </div>

        {/* Shared Clipboard Widget */}
        <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-sm font-bold text-white">Shared Clipboard</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">INSTANT SYNC</span>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={clipboardInput}
              onChange={(e) => setClipboardInput(e.target.value)}
              placeholder="Paste text or links here to sync..."
              className="w-full bg-[#080b13] border border-[#202941] rounded-2xl p-4 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#7b80ff]/50 resize-none leading-relaxed pr-8"
            />
            {/* Double green status dots at bottom-right of text container */}
            <div className="absolute bottom-4 right-4 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                if (clipboardInput.trim()) {
                  // Direct broadcast from Dashboard
                  navigator.clipboard.writeText(clipboardInput);
                }
              }}
              className="flex-1 bg-[#1a2235] hover:bg-[#252f4c] text-white border border-[#2e3b5e]/40 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            >
              Sync to Peer
            </button>
            <button 
              onClick={handleCopyClipboardInput}
              className="flex-1 border border-[#2e3b5e]/80 hover:bg-[#1a2235] text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            >
              {clipboardCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Connected Device Status Pane */}
        <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1b2237] border border-[#2e3b5e]/40 flex items-center justify-center text-slate-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {isConnected ? (peerDeviceName || 'Connected Device') : 'No Connected Device'}
                </h4>
                {isConnected ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 block tracking-wider mt-0.5">
                {isConnected ? 'ACTIVE CONNECTION' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#1d263b]/50 pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Latency</span>
              <span className="text-white font-semibold">1ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Local Subnet</span>
              <span className="text-white font-semibold">192.168.1.42</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}