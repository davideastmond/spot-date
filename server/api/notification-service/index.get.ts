import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { serverSentEventManager } from "~/lib/server-sent-event-manager/server-sent-event-manager";

export default defineEventHandler(async (event) => {
  // protect the route
  const authSession = await getServerSession(event, authOptions);

  if (!authSession || !authSession.user) {
    return { status: 401, body: { message: "Unauthorized" } };
  }

  const instanceClient = {
    id: crypto.randomUUID(),
    h_event: event,
    userId: authSession.user.id,
  };
  serverSentEventManager.addClient(instanceClient);
  serverSentEventManager.emitToClient(instanceClient, "connect", {
    message: "Connected",
  });

  event.node.req.on("close", () =>
    serverSentEventManager.removeClient(instanceClient.id)
  );

  event._handled = true;
});
