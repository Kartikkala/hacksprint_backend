import { NotificationDatabase } from "../db/Notifications/db";

export default class NotificationManager{
    private notificationDatabase : NotificationDatabase;
    constructor(notificationDatabase : NotificationDatabase)
    {
        this.notificationDatabase = notificationDatabase
    }
    public async getAllNotifications() {
       return await this.notificationDatabase.getNotifications();
    }
    public async createNotification(title : string, description : string){
      return await this.notificationDatabase.addNotification(title, description);
    }
    public async deleteNotification(id : string) {
       return await this.notificationDatabase.removeNotification(id)
    }
    public async updateNotification(id : string, title : string, description : string){
      return await this.notificationDatabase.updateNotification(id, title, description);
    }
}