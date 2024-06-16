import { Request, Response } from "express";
import ChatUseCase from "../../../userCase/user/chatUseCase";
import { Express } from "express";
class ChatController {
  constructor(private _chatUseCase: ChatUseCase) {}

  async accessChat(req: Request, res: Response): Promise<void> {
    try {
      const { participantId } = req.body;
      const chatResponse = await this._chatUseCase.accessChat(
        participantId,
        req.user?.id as string
      );

      if (chatResponse.status) {
        res.status(201).json(chatResponse);
      } else {
        res.status(400).json(chatResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async fetchAllChat(req: Request, res: Response): Promise<void> {
    try {
      const allChatResponse = await this._chatUseCase.fetchAllChat(
        req.user?.id as string
      );

      if (allChatResponse.status) {
        res.status(200).json(allChatResponse);
      } else {
        res.status(400).json(allChatResponse);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, message } = req.body;

      const files: Express.Multer.File[] =
        req.files as Express.Multer.File[];

        
      const newMessage = await this._chatUseCase.sendMessage(
        req.user?.id as string,
        chatId,
        message,
        files
      );

      if (newMessage.status) {
        res.status(201).json(newMessage);
      } else {
        res.status(400).json(newMessage);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }

  async fetchAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const messages = await this._chatUseCase.fetchAllMessages(chatId);

      if (messages.status) {
        res.status(200).json(messages);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
}

export default ChatController;
