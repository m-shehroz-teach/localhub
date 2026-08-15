import React from 'react';

export default function DragDropZone({ onFilesSelected }) {
  return (
    <div className="bg-[#0c0f1d] border border-border-card rounded-3xl p-6 relative">
      <div className="border border-dashed border-[#242f4c] hover:border-primary/50 rounded-2xl p-12 transition-all bg-[#080b13]/40 flex flex-col items-center justify-center relative min-h-[300px]">
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
        
        <button className="mt-6 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-text text-xs font-bold transition-all shadow-md shadow-primary/10">
          Select Files
        </button>
      </div>
    </div>
  );
}
