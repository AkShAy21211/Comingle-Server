export type NotificationType = 'followRequest'| 'followAccept' | 'like' | 'comment';

export const NotificationDetails: Record<NotificationType, { displayName: string, content: string }> = {
    followRequest: {
        displayName: 'Follow',
        content: 'has started following you'
    },
    followAccept: {
        displayName: 'Follow',
        content: 'has accepted your request'
    },
    like: {
        displayName: 'Like',
        content: 'has liked your post'
    },
    comment: {
        displayName: 'Comment',
        content: 'has commented on your post'
    }
};

export default  NotificationDetails