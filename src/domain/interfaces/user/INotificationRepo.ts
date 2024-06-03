import Notifications from "../../entities/notification";

interface INotificationRepo{


    createNotification(id:string,type:string,content:string,sourceId:string):Promise<void>;
    getNotifications(id:string):Promise<Notifications[]|null|undefined>;
    
}


export default INotificationRepo;