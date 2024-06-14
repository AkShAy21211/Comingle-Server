import Chat from "../../entities/chat";
import Message from '../../entities/message';

interface IChatReposotory{


    creteChat(participantId:string,currentUserId:string):Promise<Chat|null|undefined>;
    findChat(participantId:string,currentUserId:string):Promise<Chat|null|undefined>;
    fetchAllChat(userId:string):Promise<Chat[]|null|undefined>;
    updateChat(id:string,latestMessage:Message):Promise<void>;
}

export default IChatReposotory;