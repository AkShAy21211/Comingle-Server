interface IInteractionUseCase{

    followUser(requester:string,recipient:string):Promise<any>;
    getAllUsers(id:string):Promise<any>;
    createNotificatiioin(id:string,type:string,content:string):Promise<void>;
    getAllNotifications(id:string):Promise<any>;


}

export default IInteractionUseCase;