import Chat from "../../domain/entities/chat";
import Message from "../../domain/entities/message";
import IChatReposotory from "../../domain/interfaces/user/IChatRepo";
import chatModel from "../database/chatModel";
import ChatModel from "../database/chatModel";
import UserModel from "../database/userModel";

class ChatReposotory implements IChatReposotory {
  async creteChat(
    participantId: string,
    currentUserId: string
  ): Promise<Chat | null | undefined> {
    try {
      const chat = new ChatModel({
        chatName: "OneTwoOne",
        isGroupChat: false,
        participants: [participantId, currentUserId],
      });

      await chat.save();

      const newChat = await ChatModel.findOne({ _id: chat._id })
        .populate("participants", "-password")
        .lean();

      return newChat;
    } catch (error) {
      console.log(error);
    }
  }

  async findChat(
    participantId: string,
    currentUserId: string
  ): Promise<Chat | null | undefined> {
    try {
      let chat: any = await chatModel
        .find({
          isGroupChat: false,
          $and: [
            { participants: { $elemMatch: { $eq: participantId } } },
            { participants: { $elemMatch: { $eq: currentUserId } } },
          ],
        })
        .populate("participants", "-password")
        .populate("latestMessage");

      if (chat) {
        chat = await UserModel.populate(chat, {
          path: "latestMessage.sender",
          select: "username profile.image email",
        });

        return chat[0];
      }

      return;
    } catch (error) {
      console.log(error);
      throw new Error("Error finding chat");
    }
  }

  async fetchAllChat(userId: string): Promise<Chat[] | null | undefined> {
    try {
      let chats: any = await ChatModel.find({
        participants: { $elemMatch: { $eq: userId } },
      })
        .populate("participants", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      chats = await UserModel.populate(chats, {
        path: "latestMessage.sender",
        select: "username profile.image email",
      });

      return chats;
    } catch (error) {
      console.log(error);
    }
  }

  async updateChat(id: string, message: Message): Promise<void> {
    try {

      
      await chatModel.findByIdAndUpdate(id, {
        latestMessage: message ,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default ChatReposotory;
