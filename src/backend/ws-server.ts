import http from 'http';
import WebSocket, { WebSocketServer, type RawData } from 'ws';

// By extending the WebSocketServer, we can tell TypeScript about our custom 'broadcast' method.
interface ExtendedWebSocketServer extends WebSocketServer {
  broadcast?(data: any): void;
}

let wss: ExtendedWebSocketServer;

export function initWebSocket(server: http.Server) {
  wss = new WebSocketServer({ server });
  console.log('WebSocket server attached to HTTP server');
  // Broadcast to all clients
  wss.broadcast = (data) => {
    const msg = typeof data === 'string' ? data : JSON.stringify(data);
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) client.send(msg);
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    // Send welcome message
    ws.send('Welcome! You are connected to the WebSocket server.');
    // Listen for messages from clients
    ws.on('message', (message: RawData) => {
      console.log(`Received: ${message}`);
      // Broadcast the received message to all clients
      // The message is a Buffer, so we convert it to a string before broadcasting.
      // The '!' tells TypeScript we are sure 'broadcast' is defined here.
      wss.broadcast!(message.toString());
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

interface StatusPayload {
  uploadId: string;
  stage: string;
}

export function emitStatus({ uploadId, stage }: StatusPayload) {
  if (!uploadId || !stage || !wss) return;
  wss.broadcast!({ type: "status", uploadId, stage });
  console.log("broadcast", uploadId, stage);
}
