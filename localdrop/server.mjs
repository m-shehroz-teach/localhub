import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = 8080;
const server = createServer();
const wss = new WebSocketServer({ server });

const rooms = new Map();

wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'JOIN_ROOM': {
          currentRoom = data.roomKey;
          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }
          const roomClients = rooms.get(currentRoom);
          
          if (roomClients.size >= 2) {
            ws.send(JSON.stringify({ type: 'ROOM_FULL' }));
            return;
          }

          roomClients.add(ws);
          const isInitiator = roomClients.size === 2;

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            isInitiator
          }));

          if (isInitiator) {
            for (const client of roomClients) {
              if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify({ type: 'READY' }));
              }
            }
          }
          break;
        }

        case 'SIGNAL': {
          if (currentRoom && rooms.has(currentRoom)) {
            for (const client of rooms.get(currentRoom)) {
              if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify({
                  type: 'SIGNAL',
                  payload: data.payload
                }));
              }
            }
          }
          break;
        }
      }
    } catch (err) {
      console.error('Signaling server error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const roomClients = rooms.get(currentRoom);
      roomClients.delete(ws);
      if (roomClients.size === 0) {
        rooms.delete(currentRoom);
      } else {
        for (const client of roomClients) {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'PEER_DISCONNECTED' }));
          }
        }
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ LocalDrop signaling server running on ws://0.0.0.0:${PORT}`);
});