import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeCard({ shareableUrl }) {
  return (
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
  );
}
