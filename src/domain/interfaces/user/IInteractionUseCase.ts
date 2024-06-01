interface IInteractionUseCase{

    followUser(requester:string,recipient:string):Promise<any>;
}

export default IInteractionUseCase;