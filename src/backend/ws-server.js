import WebSocket, { WebSocketServer } from 'ws';

let wss;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });
  console.log('WebSocket server attached to HTTP server');
  // Broadcast to all clients
  wss.broadcast = (data) => {
    const msg = typeof data === 'string' ? data : JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(msg);
    });
  };

  wss.on('connection', (ws) => {
    console.log('Client connected');
    // Send welcome message
    ws.send('Welcome! You are connected to the WebSocket server.');
    // Listen for messages from clients
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      // Broadcast the received message to all clients
      wss.broadcast(message);
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

export function emitStatus({ uploadId, stage }) {
  if (!uploadId || !stage || !wss) return;
  wss.broadcast({ type: "status", uploadId, stage });
  console.log("broadcast", uploadId, stage);
}
