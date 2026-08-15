import Peer from 'simple-peer';

// Generates a unique, short room/peer key for connecting devices
export function generatePeerKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Stores custom device name in localStorage until connection ends
export function getSavedDeviceName() {
  let name = localStorage.getItem('localdrop_device_name');
  if (!name) {
    name = `Device-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('localdrop_device_name', name);
  }
  return name;
}

export function saveDeviceName(name) {
  localStorage.setItem('localdrop_device_name', name);
}

export function clearSessionData() {
  // Clears active session data when connection terminates
  localStorage.removeItem('localdrop_active_session');
}