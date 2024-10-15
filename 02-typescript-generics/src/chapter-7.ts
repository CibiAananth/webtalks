// event bus

/**
{
"ping": [()=>{}, ()=>{}]
}

*/
class EventBus<TEvents> {
  private listeners = new Map();

  on<T extends keyof TEvents>(
    eventName: T,
    listener: (data: TEvents[T]) => void,
  ) {
    const listeners = this.listeners.get(eventName) || [];

    listeners.push(listener);

    this.listeners.set(eventName, listeners);
  }

  emit<T extends keyof TEvents>(
    eventName: T,
    ...data: TEvents[T] extends never ? [] : [TEvents[T]]
  ) {
    const eventListeners = this.listeners.get(eventName);

    if (!eventListeners) return;

    for (const listener of eventListeners) {
      if (!listener) continue; // Skip if listener is undefined (this can happen if the listener is removed while emitting

      void listener(data);
    }
  }
}

type Events = {
  ping: never;
  greeting: string;
  connection: {
    roomId: string;
  };
};

const bus = new EventBus<Events>();

bus.on("ping", (data) => {
  console.log("ping", data);
});

bus.on("connection", (data) => {
  console.log("connection", data);
});

bus.emit("ping");

bus.emit("connection", {
  roomId: "asldknj",
});

function something(...args: any[]) {
  console.log(args);
}

something();
