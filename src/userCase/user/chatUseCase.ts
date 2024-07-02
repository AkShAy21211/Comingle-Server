import e from "express";
import IChatReposotory from "../../domain/interfaces/user/IChatRepo";
import IChatUseCase from "../../domain/interfaces/user/IChatUseCase";
import IMessageReposotroy from "../../domain/interfaces/user/IMessageRepo";
import {
  uploadChats,
  uploadPosts,
} from "../../infrastructure/utils/uploadToCloudnary";

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
    message: string,
    files: Express.Multer.File[]
  ): Promise<any> {
    try {
      const uploadedFiles: { url: string; type: string }[] = [];

      if (files && files.length > 0) {
        const results: { url: string; resource: string }[] = await Promise.all(
          files.map((file) => uploadChats(file, "chats"))
        );

        
        if (!results) {

          return {
            status: false,
            message: "Error sending file please try again",
          };
        }

        results.forEach((result) => {
          uploadedFiles.push({ url: result.url, type: result.resource });
        });
      }

      const data = {
        sender: senderId,
        chat: chatId,
        message: message || "",
        files: uploadedFiles,
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
        message: "Unable to sent message ",
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
