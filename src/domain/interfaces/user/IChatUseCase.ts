interface IChatUseCase{


    accessChat(participants:string,currentUserId:string):Promise<any>;
    fetchAllChat(userId:string):Promise<any>;
    sendMessage(senderId:string,chatId:string,message:string):Promise<any>;
    fetchAllMessages(chatId:string):Promise<any>;
    
}

export default IChatUseCase;