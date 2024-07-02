import mongoose, { mongo, Schema } from "mongoose";
import Engagement from "../../domain/entities/engagemant";

const engagementSchema = new Schema<Engagement>(
  {
    likeConut: {
      type: Number,
      default: 0,
    },
    followConut: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    postCount:{
       type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const engagementModal = mongoose.model("Engagement", engagementSchema);

export default engagementModal;
