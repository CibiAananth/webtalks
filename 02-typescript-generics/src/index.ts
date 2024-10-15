class EventBus {
  private listeners = new Map();

  on(eventName, listener) {
    const listeners = this.listeners.get(eventName) || [];

    listeners.push(listener);

    this.listeners.set(eventName, listeners);

    // Return an unsubscribe function
    return () => this.off(eventName, listener);
  }

  off(eventName, listener) {
    const eventListeners = this.listeners.get(eventName);

    if (eventListeners) {
      const filteredListeners = eventListeners.filter((l) => l !== listener);

      if (filteredListeners.length) {
        this.listeners.set(eventName, filteredListeners);
      } else {
        this.listeners.delete(eventName);
      }
    }
  }

  emit(eventName, args) {
    const eventListeners = this.listeners.get(eventName);

    if (!eventListeners) return;

    for (const listener of eventListeners) {
      if (!listener) continue; // Skip if listener is undefined (this can happen if the listener is removed while emitting

      void listener(args);
    }
  }
}

export { EventBus };

const bus = new EventBus();

bus.on("ping", (data) => {
  console.log("data", data);
});

bus.emit("ping", "hello1");
bus.emit("ping", "hello2");
bus.emit("ping", "hello3");
