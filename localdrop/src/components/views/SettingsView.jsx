import React, { useState } from 'react';
import { Sliders, Check, Save } from 'lucide-react';

export default function SettingsView({ deviceName, onSaveDeviceName }) {
  const [nameInput, setNameInput] = useState(() => {
    // Check Cookie
    const match = document.cookie.match(/(?:^|; )localdrop_device_name=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
    // Check LocalStorage
    return localStorage.getItem('localdrop_device_name') || deviceName;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName) return;

    // Propagate up to App state
    onSaveDeviceName(cleanName);

    // Save to LocalStorage
    localStorage.setItem('localdrop_device_name', cleanName);
    
    // Save to Cookies (1 year expiration)
    document.cookie = `localdrop_device_name=${encodeURIComponent(cleanName)}; path=/; max-age=31536000`;

    // Save to Cache storage API
    if ('caches' in window) {
      caches.open('localdrop-settings').then((cache) => {
        cache.put('/device-name', new Response(cleanName));
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultName = `Device-${Math.floor(Math.random() * 9000) + 1000}`;
    setNameInput(defaultName);
    onSaveDeviceName(defaultName);
    localStorage.setItem('localdrop_device_name', defaultName);
    document.cookie = `localdrop_device_name=${encodeURIComponent(defaultName)}; path=/; max-age=31536000`;
    
    if ('caches' in window) {
      caches.open('localdrop-settings').then((cache) => {
        cache.put('/device-name', new Response(defaultName));
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure your device identity for peer discovery and local sharing.
        </p>
      </div>

      {/* Main Settings Panel */}
      <div className="bg-[#0c0f1d] border border-[#1d263b]/50 rounded-3xl p-6 space-y-6">
        
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#1d263b]/40">
          <Sliders className="w-4 h-4 text-[#7b80ff]" />
          <h3 className="text-base font-bold text-white">General</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Device Name input */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              DEVICE NAME
            </label>
            <p className="text-xs text-slate-400 mb-3">
              This name will be visible to other devices on the network.
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-[#080b13] border border-[#1e273f] rounded-2xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-[#7b80ff]/40"
              placeholder="e.g. MacBook Pro"
            />
          </div>

          {/* Action Buttons at the bottom right */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1d263b]/20">
            <button 
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-[#080b13] border border-[#1d263b]/80 hover:bg-[#151a2d] text-slate-300 text-xs font-mono font-bold transition-all uppercase tracking-wider"
            >
              Reset Defaults
            </button>
            <button 
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#7b80ff] hover:bg-[#6c71f0] text-[#1a1754] text-xs font-bold transition-all shadow-md shadow-[#7b80ff]/10 flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved Changes
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}