import type { DirectMessageSession } from "~/lib/models/direct-message/direct-message";
import type { ChosenMedia } from "~/lib/types/user-posts/media";

export function useDm() {
  async function createDm({
    text,
    multimedia = [],
    receiverIds,
  }: {
    text: string;
    multimedia?: ChosenMedia[];
    receiverIds: string[];
  }) {
    const res = await $fetch<{ status: string; id: string }>(`/api/dms`, {
      method: "POST",
      body: { content: { text, multimedia }, receiverIds },
    });
    return res.id;
  }

  /**
   * Fetches the current user's DM sessions and any conversations they are in
   */
  async function fetchDmSessions() {
    const res = await $fetch<{ sessions: DirectMessageSession[] }>("/api/dms");
    if (!res.sessions) {
      return [];
    }

    return res.sessions;
  }

  async function sendMessageBySessionId({
    sessionId,
    text,
    multimedia = [],
    receiverIds,
  }: {
    sessionId: string;
    text: string;
    multimedia?: ChosenMedia[];
    receiverIds: string[];
  }) {
    await $fetch<{ status: string; id: string }>(`/api/dms/${sessionId}`, {
      method: "POST",
      body: { content: { text, multimedia }, receiverIds },
    });
  }

  return {
    createDm,
    fetchDmSessions,
    sendMessageBySessionId,
  };
}
