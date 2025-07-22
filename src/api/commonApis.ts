import { api } from "./axios";
import { io } from "socket.io-client";
export const socket=io("http://localhost:3000")
// utils/api/notification.ts
import axios from "axios";

interface NotificationData {
  recipient: string;
  type: "friend_request" | "friend_accept" | "like_post";
  postId?: string;
}

export const createNotification = async (
  data: NotificationData,
  token: string
) => {
  await axios.post("http://localhost:5000/api/notifications", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likeOrUnlikePost = (postId: string) => {
  return api.post(`/post/like/${postId}`)
  .then(() => console.log("Post liked/unliked successfully"))
  .catch(() => alert("Failed to like/unlike post"));
}