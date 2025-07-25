import { api } from "./axios";
import { io } from "socket.io-client";

// ✅ Socket instance
export const socket = io("http://localhost:3000", {
  withCredentials: true,
});
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

export const likeOrUnlikePost = (postId: string, userId: string) => {
  return api
    .post(`/post/like/${postId}`)
    .then(() => {
      console.log("Post liked/unliked successfully");

      // 🔁 Emit socket event
      socket.emit("like_post", { postId, userId });
    })
    .catch(() => alert("Failed to like/unlike post"));
};
