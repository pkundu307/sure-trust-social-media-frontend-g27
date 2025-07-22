import { api } from "./axios";
import { io } from "socket.io-client";

// ✅ Socket instance
export const socket = io("http://localhost:3000", {
  withCredentials: true,
});

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
