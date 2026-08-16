import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import DashboardView from './components/views/DashboardView';
import RecentTransfersView from './components/views/RecentTransfersView';
import SharedClipboardView from './components/views/SharedClipboardView';
import SettingsView from './components/views/SettingsView';
import { useWebRTC } from './hooks/useWebRTC';

function getDeviceName() {
  const match = document.cookie.match(/(?:^|; )localdrop_device_name=([^;]*)/);
  if (match) return decodeURIComponent(match[1]);
  const ls = localStorage.getItem('localdrop_device_name');
  if (ls) return ls;
  const randId = `Device-${Math.floor(Math.random() * 9000) + 1000}`;
  localStorage.setItem('localdrop_device_name', randId);
  document.cookie = `localdrop_device_name=${encodeURIComponent(randId)}; path=/; max-age=31536000`;
  return randId;
}

function generateRoomKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let key = '';
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('localdrop_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('localdrop_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Live Device Name loaded from cookie, localStorage
  const [deviceName, setDeviceName] = useState(() => getDeviceName());

  // Sync to Cache Storage on load / change
  useEffect(() => {
    if ('caches' in window) {
      caches.open('localdrop-settings').then((cache) => {
        cache.match('/device-name').then((res) => {
          if (res) {
            res.text().then((name) => {
              if (name && name !== deviceName) {
                setDeviceName(name);
                localStorage.setItem('localdrop_device_name', name);
                document.cookie = `localdrop_device_name=${encodeURIComponent(name)}; path=/; max-age=31536000`;
              }
            });
          } else {
            cache.put('/device-name', new Response(deviceName));
          }
        });
      });
    }
  }, [deviceName]);

  // Room Key from URL param if present, or generate/save in state
  const [roomKey] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoom = urlParams.get('room');
    if (urlRoom && urlRoom.length === 6) {
      return urlRoom.toUpperCase();
    }
    return generateRoomKey();
  });

  // WebRTC Hook
  const {
    isConnected,
    activeTransfer,
    filesHistory,
    receivedText,
    peerDeviceName,
    sendFile,
    cancelTransfer,
    sendClipboard
  } = useWebRTC(roomKey, deviceName);

  // --- LIVE CLIPBOARD STATE & HISTORY ---
  const [clipboardText, setClipboardText] = useState(() => {
    return localStorage.getItem('localdrop_live_clipboard') || '// Type or paste snippet here to sync...';
  });

  const [clipboardHistory, setClipboardHistory] = useState(() => {
    const saved = localStorage.getItem('localdrop_clipboard_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to process clipboard items received from WebRTC
  useEffect(() => {
    if (receivedText) {
      setClipboardText(receivedText);
      localStorage.setItem('localdrop_live_clipboard', receivedText);

      const entry = {
        id: Date.now(),
        type: receivedText.startsWith('http') ? 'URL' : 'Snippet',
        content: receivedText,
        from: 'Peer Device',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setClipboardHistory((prev) => {
        if (prev.length > 0 && prev[0].content === receivedText) {
          return prev;
        }
        const updated = [entry, ...prev.slice(0, 19)];
        localStorage.setItem('localdrop_clipboard_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [receivedText]);

  // Function to broadcast live clipboard updates
  const handleSyncClipboard = (newText) => {
    if (!newText || !newText.trim()) return;

    setClipboardText(newText);
    localStorage.setItem('localdrop_live_clipboard', newText);

    // Create live history entry
    const entry = {
      id: Date.now(),
      type: newText.startsWith('http') ? 'URL' : 'Snippet',
      content: newText,
      from: deviceName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [entry, ...clipboardHistory.slice(0, 19)]; // Keep last 20
    setClipboardHistory(updatedHistory);
    localStorage.setItem('localdrop_clipboard_history', JSON.stringify(updatedHistory));

    // Send it live
    sendClipboard(newText);
  };

  const handleClearClipboardHistory = () => {
    setClipboardHistory([]);
    localStorage.removeItem('localdrop_clipboard_history');
  };

  const handleSaveDeviceName = (newName) => {
    setDeviceName(newName);
    localStorage.setItem('localdrop_device_name', newName);
  };

  const handleFilesSelected = (files) => {
    if (!files || files.length === 0) return;
    // Send the first file selected to the peer
    sendFile(files[0]);
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-main flex font-sans antialiased relative overflow-hidden">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-8 overflow-y-auto h-screen">
        <HeaderBar
          isConnected={isConnected}
          deviceName={deviceName}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="flex-1 mt-2">
          {activeTab === 'dashboard' && (
            <DashboardView
              activeTransfer={activeTransfer}
              filesHistory={filesHistory}
              onFilesSelected={handleFilesSelected}
              isConnected={isConnected}
              roomKey={roomKey}
              deviceName={deviceName}
              peerDeviceName={peerDeviceName}
              onCancelTransfer={cancelTransfer}
            />
          )}

          {activeTab === 'recent' && (
            <RecentTransfersView filesHistory={filesHistory} />
          )}

          {activeTab === 'clipboard' && (
            <SharedClipboardView
              clipboardText={clipboardText}
              clipboardHistory={clipboardHistory}
              onSyncClipboard={handleSyncClipboard}
              onClearHistory={handleClearClipboardHistory}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              deviceName={deviceName}
              onSaveDeviceName={handleSaveDeviceName}
            />
          )}
        </div>
      </div>
    </div>
  );
}