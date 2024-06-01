interface IInteractionUseCase{

    followUser(requester:string,recipient:string):Promise<any>;
    getAllUsers(id:string):Promise<any>;

}

export default IInteractionUseCase;