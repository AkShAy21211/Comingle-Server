import Message from "../../entities/message";

interface IMessageReposotroy{


    createnewMessage(data: { sender: string; chat: string; content: string }):Promise<Message|null|undefined>;
    fetchAllMessages(chatId:string):Promise<Message[]|null|undefined>;

}


export default IMessageReposotroy;