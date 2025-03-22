import { BaseRepository } from "./base-repository";

class NotificationRepository extends BaseRepository {}

const notificationRepository = new NotificationRepository("notification");
export { notificationRepository };
