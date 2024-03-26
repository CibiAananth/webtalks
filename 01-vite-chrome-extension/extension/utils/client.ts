
import { PluginOption } from 'vite';

const getClientScript = () =>
  `
  const ws = new WebSocket("ws://localhost:5555");

  ws.onopen = () => {
    console.log("Reload server connected.");
  };
  
  ws.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data.toString());
  
    if (chrome && chrome.runtime) {
      chrome.runtime.reload();
    } else {
      window.location.reload();
    }
    ws.send(
      JSON.stringify({
        type: "UPDATE_COMPLETE",
      })
    );
  };
  
  ws.onclose = () => {
    console.warn("Reload server disconnected.");
  };
  
  `;

export function addLiveReload(): PluginOption {
  return {
    name: 'add-liveReload',
    transform(code, id) {
      if (id.endsWith('background/index.ts')) {
        code += getClientScript()
        return { code };
      }
      return null;
    },
  };
}
