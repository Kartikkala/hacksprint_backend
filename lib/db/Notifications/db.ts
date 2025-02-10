// lib/db/Notifications/db.ts
import { Model } from "mongoose";
import { INotification } from "../../../types/lib/notifications/types";
import { IDatabase } from "../../../types/lib/db/UserMangement/types";
import notificationsCollection from "./model.js";

export class NotificationDatabase  {
    private notificationCollection: Model<INotification>;
    private database: IDatabase;
    
    constructor(database: IDatabase, notificationCollectionName: string = "Notifications") {
        if (!database) {
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.notificationCollection = notificationsCollection(database, notificationCollectionName);
    }

    async getNotifications(): Promise<INotification[]> {
        const connectionStatus = await this.database.connectToDatabase();
        let result: INotification[] = [];
        if (connectionStatus) {
            try {
                result = await this.notificationCollection.find().sort({dateTime: -1}); // sorting in descending order by dateTime
            } catch(e: any) {
                console.error(e);
            }
        }
        return result;
    }
    
    async addNotification(title: string, description: string): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if (connectionStatus) {
            try {
                const newNotification = {
                    title,
                    description,
                    dateTime: new Date()
                };
                await this.notificationCollection.create(newNotification);
                return true;
            } catch(e) {
                console.error(e);
            }
        }
        return false;
    }
    
    async removeNotification(notificationId: string): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if (connectionStatus) {
            try {
                await this.notificationCollection.findByIdAndDelete(notificationId);
                return true;
            } catch(e) {
                console.error(e);
            }
        }
        return false;
    }
    
    async updateNotification(notificationId: string, title?: string, description?: string): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if (connectionStatus) {
            try {
                let updatedNotification = {};
                if (title) {
                    updatedNotification = {...updatedNotification, title};
                } 
                if (description) {
                    updatedNotification = {...updatedNotification, description};
                } 
                await this.notificationCollection.findByIdAndUpdate(notificationId, updatedNotification);
                return true;
            } catch(e) {
                console.error(e);
            }
        }
        return false;
    }
}