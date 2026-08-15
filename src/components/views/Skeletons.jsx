import React from 'react';

// QR Code Card Skeleton: Square box with shimmering center block.
export function QRCodeSkeleton() {
  return (
    <div className="space-y-4 w-full flex flex-col items-center py-2 animate-pulse">
      <div className="relative p-6 bg-bg-card border border-border-card rounded-2xl">
        <div className="w-[154px] h-[154px] rounded-lg animate-shimmer" />
      </div>
      <div className="h-3 w-40 rounded bg-[#1e293b] animate-shimmer" />
    </div>
  );
}

// Drag & Drop Zone Skeleton: Dashed border outline with a centered shimmering icon circle and progress bar shape.
export function DragDropSkeleton() {
  return (
    <div className="bg-[#0c0f1d] border border-border-card rounded-3xl p-6 relative animate-pulse">
      <div className="border border-dashed border-[#242f4c] rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-[#1e293b] mb-6 animate-shimmer" />
        <div className="h-5 w-48 rounded bg-[#1e293b] mb-3 animate-shimmer" />
        <div className="h-3.5 w-36 rounded bg-[#1e293b] mb-6 animate-shimmer" />
        <div className="h-9 w-28 rounded-full bg-[#1e293b] animate-shimmer" />
      </div>
    </div>
  );
}

// FAQ Accordion Skeleton: Stack of 4 gray shimmering rounded bars.
export function FaqSkeleton() {
  return (
    <div className="mt-16 max-w-4xl mx-auto px-4 py-8 border-t border-border-card space-y-6 animate-pulse">
      <div className="flex flex-col items-center mb-8 space-y-3">
        <div className="h-8 w-64 rounded bg-[#1e293b] animate-shimmer" />
        <div className="h-4 w-96 rounded bg-[#1e293b] animate-shimmer" />
      </div>
      
      <div className="relative max-w-lg mx-auto mb-8">
        <div className="w-full h-11 rounded-xl bg-[#1e293b] animate-shimmer" />
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <div className="h-9 w-28 rounded-xl bg-[#1e293b] animate-shimmer" />
        <div className="h-9 w-28 rounded-xl bg-[#1e293b] animate-shimmer" />
        <div className="h-9 w-28 rounded-xl bg-[#1e293b] animate-shimmer" />
        <div className="h-9 w-28 rounded-xl bg-[#1e293b] animate-shimmer" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-[#1e293b] animate-shimmer" />
        ))}
      </div>
    </div>
  );
}
