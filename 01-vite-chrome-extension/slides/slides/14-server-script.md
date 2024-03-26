---
routeAlias: server-script
headingLevel: 3
---

### Server script

<div class="mt-1">

<div v-click>

Server script is a simple WebSocket server that listens for file changes and sends a message to the client to reload the page.

</div>


<div v-click>

````md magic-move {at:3}


```js {*}
import { WebSocketServer } from 'ws';

function server() {
  const ws = new WebSocketServer({ port: 5000 });
}
```

```js {*|8}
import { WebSocketServer } from 'ws';

function server() {
  const ws = new WebSocketServer({ port: 5000 });
  ws.on('connection', (ws) => {
    ws.onmessage = message => {
      const { type } = JSON.parse(message.data.toString());
      if (type === 'UPDATE_COMPLETE') ws.close()
    };
  });
}
```

```js {13-16}
import { WebSocketServer } from 'ws';

function server() {
  const ws = new WebSocketServer({ port: 5000 });
  ws.on('connection', (ws) => {
    ws.onmessage = message => {
      const { type } = JSON.parse(message.data.toString());
      if (type === 'UPDATE_COMPLETE') ws.close()
    };
  });
}

chokidar.watch('dist').on('all', event => {
  if (event !== 'add' && event !== 'addDir') return;
  notifyClients();
});

```

````

</div>

</div>

---
transition: fade
---

````md magic-move {at:1}

```js {20-27|24}
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

function notifyClients(){
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'UPDATE_REQUEST' }));
    }
  });
}
```

````

<!-- 
There are some more issues to be addressed,
- Debounce the file changes
- Copy the manifest after build is complete and then notify the clients
 -->