import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';

let ws;
function server() {
  ws = new WebSocketServer({ port: 5000 });
  ws.on('connection', (ws) => {
    ws.onmessage = message => {
      const { type } = JSON.parse(message.data.toString());
      if (type === 'UPDATE_COMPLETE') ws.close()
    };
  });
}
server()

chokidar.watch('dist').on('all', event => {
  if (event !== 'add' && event !== 'addDir') return;
  notifyClients();
});

function notifyClients() {
  console.log("notifyClients");
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'UPDATE_REQUEST' }));
    }
  });
}