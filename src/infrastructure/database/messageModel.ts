import mongoose, { model, Schema } from "mongoose";
import Message from "../../domain/entities/message";

const messageSchema = new Schema<Message>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    files: [
      {
        url: {
          type: String,
        },
        type: {
          type: String,
          trim: true,
        },
      },
    ],
    message: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const messageModel = model("Message", messageSchema);

export default messageModel;
