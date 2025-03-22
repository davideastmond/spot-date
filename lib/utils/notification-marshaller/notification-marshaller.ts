import { NotificationController } from "~/lib/controllers/notification.controller";
import type { SystemNotification } from "~/lib/models/system-notification/system-notification";
import { serverSideEventManager } from "~/lib/server-side-event-manager/server-side-event-manager";

class NotificationMarshaller {
  /**
   * Dispatches all unsent notifications to users
   */
  public async dispatch() {
    const clients = serverSideEventManager.clients;
    if (clients.length === 0) {
      console.info(
        "Marshall: No clients connected to dispatch notifications to"
      );
      return;
    }

    const unsentNotifications = await this.getUnsentNotifications();
    if (unsentNotifications.length === 0) {
      console.warn("Marshall: No unsent notifications to dispatch");
      return;
    }

    const sentNotifications: string[] = [];
    unsentNotifications.forEach((notification) => {
      const foundClient = clients.find(
        (c) => c.userId === notification.targetUserId
      );
      if (foundClient) {
        this.dispatchNotification(notification);
        sentNotifications.push(notification.id as string);
      }
    });

    await Promise.all(
      sentNotifications.map((notificationId) => this.markSent(notificationId))
    );
  }

  private async markSent(notificationId: string) {
    return NotificationController.markSent(notificationId);
  }
  private async getUnsentNotifications(): Promise<
    Partial<SystemNotification>[]
  > {
    return NotificationController.getPendingNotifications();
  }

  private dispatchNotification(notification: Partial<SystemNotification>) {
    // Dispatch the notification
    serverSideEventManager.emitToUser(
      notification.targetUserId as string,
      notification.kind as string,
      notification.data as Record<string, any>
    );
  }
}

const notificationMarshaller = new NotificationMarshaller();
export { notificationMarshaller };
