// lib/db/Notifications/models.ts
import { Model } from "mongoose";
import { INotification } from "../../../types/lib/notifications/types";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";
import { notificationSchema } from "./schema.js";

export default function notificationsCollection(mongoose: IDatabase, notificationCollectionName: string): Model<INotification> {
    return mongoose.model("notification", notificationSchema(mongoose), notificationCollectionName);
}