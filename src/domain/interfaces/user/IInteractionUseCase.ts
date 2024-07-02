import Follow from "../../entities/follow";

interface IInteractionUseCase{

    followUser(requester:string,recipient:string):Promise<any>;
    getAllUsers(id:string):Promise<any>;
    createNotificatioin(id:string,type:string,content:string,sourceId:string):Promise<void>;
    getAllNotifications(id:string):Promise<any>;
    getFollowRequestStatus(requester:string,recipitent:string):Promise<any>;
    acceptFollowRequest(followId:string,notificationId:string):Promise<any>;
    findFriends(userId:string):Promise<any>;
    findFriendsSuggestions(currentUser:string):Promise<any>;
    removeFollowing(id:string,followingId:string):Promise<any>


}

export default IInteractionUseCase;