// lib/db/Notifications/schema.ts
import { Schema } from "mongoose";
import { INotification } from "../../../types/lib/notifications/types";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";

export function notificationSchema(mongoose: IDatabase): Schema<INotification> {
    return new mongoose.Schema<INotification>({
        title: String,
        description: String,
        dateTime: Date
    });
}