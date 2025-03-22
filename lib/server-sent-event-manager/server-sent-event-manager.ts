import type { H3Event } from "h3";
import { setHeaders } from "h3";
type EventClient = {
  id: string;
  h_event: H3Event;
  userId: string;
};

class ServerSentEventManager {
  private _clients: EventClient[] = [];
  constructor() {
    this._clients = [];
  }

  addClient({ id, h_event, userId }: EventClient) {
    setHeaders(h_event, {
      "cache-control": "no-cache",
      connection: "keep-alive",
      "content-type": "text/event-stream",
    });
    setResponseStatus(h_event, 200);
    this.clients.push({ id, h_event, userId });
  }

  removeClient(id: string) {
    this._clients = this._clients.filter((client) => client.id !== id);
  }

  emitToClient<T>(
    client: EventClient,
    eventName: string,
    data: Record<string, T>
  ) {
    client.h_event.node.res.write(
      `id: ${client.id}\nevent: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
    );
  }

  broadcastMessage<T>(eventName: string, data: Record<string, T>) {
    this._clients.forEach((client) =>
      this.emitToClient(client, eventName, data)
    );
  }

  emitToUser<T>(userId: string, eventName: string, data: Record<string, T>) {
    const client = this._clients.find((client) => client.userId === userId);
    if (client) {
      this.emitToClient(client, eventName, data);
      return;
    }
    console.warn("No client was found for user with id: ", userId);
  }
  get clients() {
    return this._clients;
  }
}

const serverSentEventManager = new ServerSentEventManager();
export { serverSentEventManager };
