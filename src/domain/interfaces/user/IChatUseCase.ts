interface IChatUseCase{


    accessChat(participants:string,currentUserId:string):Promise<any>;
    fetchAllChat(userId:string):Promise<any>;
    sendMessage(senderId:string,chatId:string,message:string,files:Express.Multer.File[]):Promise<any>;
    fetchAllMessages(chatId:string):Promise<any>;
    
}

export default IChatUseCase;