import React from 'react';
import { Wifi, WifiOff, ShieldCheck, Laptop } from 'lucide-react';

export default function Navbar({ ipAddress = 'Local Network', isConnected = false }) {
  return (
    <header className="w-full bg-slate-900 text-slate-100 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          ⚡
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide leading-none">LocalDrop</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            DTLS Encrypted P2P
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-300">
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
          <span>{ipAddress}</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <span>Peer Connected</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Awaiting Peer</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
