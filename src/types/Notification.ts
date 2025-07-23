export interface NotificationType {
  _id: string;
  message: string;
  type: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  relatedPostId?: string;
  isRead: boolean;
  createdAt: string;
}
