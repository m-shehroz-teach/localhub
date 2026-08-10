import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Calendar, MoreVertical, 
  FileText, ArrowUpRight, ArrowDownLeft, CheckCircle2, 
  AlertCircle, Download
} from 'lucide-react';

export default function RecentTransfersView({ filesHistory = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const mapHistoryItem = (item) => {
    return {
      id: item.id,
      name: item.name,
      size: item.size,
      direction: item.type || item.direction || 'Received',
      peer: item.peer || (item.type === 'Sent' ? 'MacBook-Pro-192.168.1.42' : 'ThinkPad-T14-192.168.1.105'),
      status: item.status || item.type || 'Received',
      datetime: item.datetime || `Today ${item.timestamp || '12:00'}`
    };
  };

  const displayHistory = filesHistory.map(mapHistoryItem);

  // Filter transfers based on search query
  const filteredTransfers = displayHistory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.peer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    if (['pdf', 'doc', 'docx'].includes(ext)) {
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

  return (
    <div className="space-y-6">
      
      {/* Header bar with Storage Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Recent Transfers</h2>
          <p className="text-sm text-slate-400 mt-1">Review and manage your local data exchanges.</p>
        </div>

        {/* Storage Gauge circle widget */}
        <div className="flex items-center gap-4 bg-[#0c0f1d] border border-[#1d263b]/50 px-5 py-3 rounded-2xl">
          {/* Circular Chart */}
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#151c2e]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#7b80ff]"
                strokeWidth="3.5"
                strokeDasharray="65, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-white">65%</span>
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 block tracking-widest uppercase">LOCAL STORAGE</span>
            <span className="text-xs font-mono font-bold text-white mt-0.5 block">128 GB / 256 GB</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input container */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files, devices, or IPs..."
            className="w-full bg-[#0c0f1d] border border-[#1d263b]/50 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#7b80ff]/40"
          />
        </div>

        {/* Action Buttons */}
        <button className="px-4 py-3 rounded-2xl bg-[#0c0f1d] border border-[#1d263b]/50 hover:bg-[#151a2d] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter Type
        </button>
        <button className="px-4 py-3 rounded-2xl bg-[#0c0f1d] border border-[#1d263b]/50 hover:bg-[#151a2d] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all">
          <Calendar className="w-3.5 h-3.5" />
          Date Range
        </button>
        <button className="p-3 rounded-2xl bg-[#0c0f1d] border border-[#1d263b]/50 hover:bg-[#151a2d] text-slate-300 transition-all">
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Transfers Data Grid/Table */}
      <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl overflow-hidden pb-4">
        
        {/* Table Headings */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1d263b]/40 text-[10px] font-mono font-bold text-slate-500 tracking-wider">
          <div className="col-span-6">FILE DETAILS</div>
          <div className="col-span-2">SIZE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2">DATE / TIME</div>
        </div>

        {/* Table Body Rows */}
        {filteredTransfers.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            No matching transfers found.
          </div>
        ) : (
          <div className="divide-y divide-[#1d263b]/20">
            {filteredTransfers.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#101426]/30 transition-colors"
              >
                
                {/* File details column */}
                <div className="col-span-6 flex items-center gap-4">
                  {getFileIcon(item.name)}
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate max-w-xs">{item.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      {item.direction === 'Sent' ? 'To:' : 'From:'} {item.peer}
                    </span>
                  </div>
                </div>

                {/* Size column */}
                <div className="col-span-2 text-sm font-semibold text-white font-mono">
                  {item.size}
                </div>

                {/* Status Badge column */}
                <div className="col-span-2">
                  {item.status === 'Sent' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d2a20] text-emerald-400 border border-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sent
                    </span>
                  )}
                  {item.status === 'Received' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d2a20] text-emerald-400 border border-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Received
                    </span>
                  )}
                  {item.status === 'Failed' && (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2a1215] text-rose-400 border border-rose-500/10">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed
                      </span>
                      <span className="block text-[9px] font-mono text-amber-500 font-bold ml-1">Connection Lost</span>
                    </div>
                  )}
                </div>

                {/* Date / Time column */}
                <div className="col-span-2 text-xs font-mono text-slate-400">
                  {item.datetime}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-2">
        <button className="px-6 py-2.5 rounded-full bg-[#1b2237] hover:bg-[#252f4c] text-xs font-mono font-bold text-slate-300 hover:text-white transition-all border border-[#2e3b5e]/40 uppercase tracking-wider">
          Load More History
        </button>
      </div>

    </div>
  );
}