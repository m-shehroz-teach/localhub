import { useState, useEffect, useRef, useCallback } from 'react';
import { encryptText, decryptText, encryptFileBuffer, decryptFileBuffer } from '../utils/encryption';

const CHUNK_SIZE = 16384; // 16 KB chunks for optimal WebRTC buffer flow

export function useWebRTC(roomKey) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTransfer, setActiveTransfer] = useState(null);
  const [filesHistory, setFilesHistory] = useState(() => {
    const saved = localStorage.getItem('localdrop_files_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('localdrop_files_history', JSON.stringify(filesHistory));
  }, [filesHistory]);
  const [receivedText, setReceivedText] = useState('');

  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const dcRef = useRef(null);

  // Buffer state for incoming files
  const incomingFileRef = useRef({
    metadata: null,
    receivedChunks: [],
    receivedSize: 0,
    startTime: 0,
    lastBytes: 0,
    lastTime: 0
  });

  const setupDataChannel = (dc) => {
    dcRef.current = dc;
    dc.binaryType = 'arraybuffer';

    dc.onopen = () => setIsConnected(true);
    dc.onclose = () => setIsConnected(false);

    dc.onmessage = async (e) => {
      if (typeof e.data === 'string') {
        const message = JSON.parse(e.data);

        if (message.type === 'CLIPBOARD') {
          try {
            const decryptedText = await decryptText(message.encrypted, roomKey);
            setReceivedText(decryptedText);
          } catch (err) {
            console.error('Failed to decrypt clipboard content:', err);
          }
        } else if (message.type === 'FILE_START') {
          incomingFileRef.current = {
            metadata: message.metadata,
            receivedChunks: [],
            receivedSize: 0,
            startTime: performance.now(),
            lastBytes: 0,
            lastTime: performance.now()
          };
          setActiveTransfer({
            fileName: message.metadata.name,
            fileSize: ((message.metadata.originalSize || message.metadata.size) / (1024 * 1024)).toFixed(2) + ' MB',
            progress: 0,
            speed: '0 MB/s',
            timeRemaining: 'Calculating...',
            direction: 'receiving'
          });
        }
      } else if (e.data instanceof ArrayBuffer) {
        const fileState = incomingFileRef.current;
        fileState.receivedChunks.push(e.data);
        fileState.receivedSize += e.data.byteLength;

        const now = performance.now();
        const duration = (now - fileState.lastTime) / 1000;

        if (duration >= 0.25 || fileState.receivedSize === fileState.metadata.size) {
          const progress = Math.min(
            100,
            Math.round((fileState.receivedSize / fileState.metadata.size) * 100)
          );
          const bytesSinceLast = fileState.receivedSize - fileState.lastBytes;
          const speedBps = bytesSinceLast / duration;
          const speedMBps = (speedBps / (1024 * 1024)).toFixed(2);

          const remainingBytes = fileState.metadata.size - fileState.receivedSize;
          const secondsRemaining = speedBps > 0 ? Math.ceil(remainingBytes / speedBps) : 0;

          setActiveTransfer({
            fileName: fileState.metadata.name,
            fileSize: ((fileState.metadata.originalSize || fileState.metadata.size) / (1024 * 1024)).toFixed(2) + ' MB',
            progress,
            speed: `${speedMBps} MB/s`,
            timeRemaining: `${secondsRemaining}s`,
            direction: 'receiving'
          });

          fileState.lastBytes = fileState.receivedSize;
          fileState.lastTime = now;
        }

        // File download completed
        if (fileState.receivedSize === fileState.metadata.size) {
          try {
            const combinedBlob = new Blob(fileState.receivedChunks);
            const combinedBuffer = await combinedBlob.arrayBuffer();
            const decryptedBuffer = await decryptFileBuffer(combinedBuffer, roomKey);
            
            const blob = new Blob([decryptedBuffer], { type: fileState.metadata.mime });
            const downloadUrl = URL.createObjectURL(blob);

            setFilesHistory((prev) => [
              {
                id: crypto.randomUUID(),
                name: fileState.metadata.name,
                size: ((fileState.metadata.originalSize || fileState.metadata.size) / (1024 * 1024)).toFixed(2) + ' MB',
                type: 'Received',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                url: downloadUrl
              },
              ...prev
            ]);
          } catch (err) {
            console.error('Failed to decrypt received file:', err);
          }

          setActiveTransfer(null);
        }
      }
    };
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'SIGNAL',
            payload: { candidate: event.candidate }
          })
        );
      }
    };

    pc.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    pcRef.current = pc;
    return pc;
  }, []);

  useEffect(() => {
    const host = window.location.hostname;
    // Connect to WebSocket signaling server
    const ws = new WebSocket(`ws://${host}:8080`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomKey }));
    };

    ws.onmessage = async (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'ROOM_JOINED' && data.isInitiator) {
        const pc = createPeerConnection();
        const dc = pc.createDataChannel('fileTransfer');
        setupDataChannel(dc);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.send(
          JSON.stringify({
            type: 'SIGNAL',
            payload: { sdp: pc.localDescription }
          })
        );
      } else if (data.type === 'SIGNAL') {
        if (!pcRef.current) createPeerConnection();
        const pc = pcRef.current;

        if (data.payload.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.payload.sdp));
          if (data.payload.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(
              JSON.stringify({
                type: 'SIGNAL',
                payload: { sdp: pc.localDescription }
              })
            );
          }
        } else if (data.payload.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.payload.candidate));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        }
      } else if (data.type === 'PEER_DISCONNECTED') {
        setIsConnected(false);
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }
      }
    };

    return () => {
      ws.close();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    };
  }, [roomKey, createPeerConnection]);

  // Streaming File Sender Engine with End-to-End Encryption
  const sendFile = async (file) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') return;

    const dc = dcRef.current;

    // Encrypt the entire file buffer first
    const arrayBuffer = await file.arrayBuffer();
    let encryptedBuffer;
    try {
      encryptedBuffer = await encryptFileBuffer(arrayBuffer, roomKey);
    } catch (err) {
      console.error('Encryption of file failed:', err);
      return;
    }

    // Send File Metadata with encrypted size
    dc.send(
      JSON.stringify({
        type: 'FILE_START',
        metadata: {
          name: file.name,
          size: encryptedBuffer.byteLength,
          mime: file.type,
          originalSize: file.size
        }
      })
    );

    let offset = 0;
    const startTime = performance.now();
    let lastTime = performance.now();
    let lastBytes = 0;

    setActiveTransfer({
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      progress: 0,
      speed: '0 MB/s',
      timeRemaining: 'Calculating...',
      direction: 'sending'
    });

    const readChunk = () => {
      while (offset < encryptedBuffer.byteLength) {
        if (dc.bufferedAmount > CHUNK_SIZE * 8) {
          // Pause reading when buffer is backed up
          setTimeout(readChunk, 10);
          return;
        }

        const chunk = encryptedBuffer.slice(offset, offset + CHUNK_SIZE);
        dc.send(chunk);
        offset += chunk.byteLength;

        const now = performance.now();
        const duration = (now - lastTime) / 1000;

        if (duration >= 0.25 || offset === encryptedBuffer.byteLength) {
          const progress = Math.min(100, Math.round((offset / encryptedBuffer.byteLength) * 100));
          const bytesSinceLast = offset - lastBytes;
          const speedBps = bytesSinceLast / duration;
          const speedMBps = (speedBps / (1024 * 1024)).toFixed(2);

          const remainingBytes = encryptedBuffer.byteLength - offset;
          const secondsRemaining = speedBps > 0 ? Math.ceil(remainingBytes / speedBps) : 0;

          setActiveTransfer({
            fileName: file.name,
            fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            progress,
            speed: `${speedMBps} MB/s`,
            timeRemaining: `${secondsRemaining}s`,
            direction: 'sending'
          });

          lastBytes = offset;
          lastTime = now;
        }
      }

      // Record Sent File in History
      setFilesHistory((prev) => [
        {
          id: crypto.randomUUID(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: 'Sent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);

      setActiveTransfer(null);
    };

    readChunk();
  };

  const sendClipboard = async (text) => {
    if (dcRef.current && dcRef.current.readyState === 'open') {
      try {
        const encrypted = await encryptText(text, roomKey);
        dcRef.current.send(
          JSON.stringify({
            type: 'CLIPBOARD',
            encrypted
          })
        );
      } catch (err) {
        console.error('Error encrypting clipboard text:', err);
      }
    }
  };

  return {
    isConnected,
    activeTransfer,
    filesHistory,
    receivedText,
    sendFile,
    sendClipboard,
    setFilesHistory
  };
}