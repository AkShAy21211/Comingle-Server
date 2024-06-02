export type NotificationType = 'follow' | 'like' | 'comment';

export const NotificationDetails: Record<NotificationType, { displayName: string, content: string }> = {
    follow: {
        displayName: 'Follow',
        content: 'has started following you'
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