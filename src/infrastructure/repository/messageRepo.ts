import Message from "../../domain/entities/message";
import IMessageReposotroy from "../../domain/interfaces/user/IMessageRepo";
import MessageModel from "../database/messageModel";
import UserModel from "../database/userModel";

class MessageReposotory implements IMessageReposotroy {
  async createnewMessage(data: {
    sender: string;
    chat: string;
    files:{url:string,type:string}[]
    message: string;
  }): Promise<Message | null> {
    try {
      const newMessage = new MessageModel({
        ...data,
      });

      await newMessage.save();

      let populatedMessage: any = await (
        await newMessage.populate("sender", "-password")
      ).populate("chat");

      populatedMessage = await UserModel.populate(populatedMessage, {
        path: "chat.participants",
        select: "username profile.image email",
      });

      return populatedMessage;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async fetchAllMessages(
    chatId: string
  ): Promise<Message[] | null | undefined> {
    try {
      const messages = await MessageModel.find({ chat: chatId })
        .populate("sender", "-password")
        .populate("chat").lean()

        return messages;

    } catch (error) {
      console.log(error);
    }
  }
}

export default MessageReposotory;
