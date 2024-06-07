import mongoose, { Schema } from "mongoose";
import Notifications from "../../domain/entities/notification";



const notificationSchema = new Schema<Notifications>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    sourceId:{
        type: mongoose.Schema.Types.ObjectId,
        refPath:'type',
        required:true

    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

notificationSchema.index({ createdAt: 1 });

const notificationModel = mongoose.model<Notifications>('Notification', notificationSchema);

export default notificationModel;
