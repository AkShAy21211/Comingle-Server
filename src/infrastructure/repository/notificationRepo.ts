import Notifications from "../../domain/entities/notification";
import INotificationRepo from "../../domain/interfaces/user/INotificationRepo";
import notificationModel from "../database/notificationModel";

class NotificationRepo implements INotificationRepo {
  
  async createNotification(
    id: string,
    type: string,
    content: string,
    sourceId:string
  ): Promise<void> {
    try {
      const newNotification = new notificationModel({
        userId: id,
        type: type,
        content: content,
        sourceId:sourceId
      });

      await newNotification.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getNotifications(
    id: string
  ): Promise<Notifications[] | null | undefined> {
    try {
      const notifications = await notificationModel.find({
        isRead: false,
        userId: id,
      }).populate('sourceId').sort({createdAt:-1});

      return notifications;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteNotification(id:string):Promise<void>{

    try {
      
      await notificationModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      
    }
  }

 
}

export default NotificationRepo;
