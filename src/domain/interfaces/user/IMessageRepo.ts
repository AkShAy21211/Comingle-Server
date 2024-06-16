import Message from "../../entities/message";

interface IMessageReposotroy{


    createnewMessage(data: { sender: string; chat: string; message: string ,files:{url:string,type:string}[]}):Promise<Message|null|undefined>;
    fetchAllMessages(chatId:string):Promise<Message[]|null|undefined>;

}


export default IMessageReposotroy;