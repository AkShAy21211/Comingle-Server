import e from "express";
import IChatReposotory from "../../domain/interfaces/user/IChatRepo";
import IChatUseCase from "../../domain/interfaces/user/IChatUseCase";
import IMessageReposotroy from "../../domain/interfaces/user/IMessageRepo";

class ChatUseCase implements IChatUseCase {
  constructor(
    private _chatRepo: IChatReposotory,
    private _messageRepo: IMessageReposotroy
  ) {}

  async accessChat(participantId: string, currentUserId: string): Promise<any> {
    try {
      const existingChat = await this._chatRepo.findChat(
        participantId,
        currentUserId
      );

      if (existingChat) {
        return {
          status: true,
          chat: existingChat,
        };
      } else {
        const newChat = await this._chatRepo.creteChat(
          participantId,
          currentUserId
        );

        if (newChat) {
          return {
            status: true,
            chat: newChat,
     
          };
        }

        return {
          status: false,
          message: "Something went wrong please retry",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAllChat(userId: string): Promise<any> {
    try {
      const chats = await this._chatRepo.fetchAllChat(userId);

      if (chats) {
        return {
          status: true,
          chats: chats,
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(
    senderId: string,
    chatId: string,
    message: string
  ): Promise<any> {
    try {
      const data = {
        sender: senderId,
        chat: chatId,
        content: message,
      };

      const newMessage = await this._messageRepo.createnewMessage(data);

      if (newMessage) {
        await this._chatRepo.updateChat(chatId, newMessage);

        return {
          status: true,
          message: newMessage,
        };
      }

      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async fetchAllMessages(chatId: string): Promise<any> {
    try {
      const messages = await this._messageRepo.fetchAllMessages(chatId);

      if (messages) {
        return {
          status: true,
          messages: messages,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default ChatUseCase;
