import { api } from "./axios";
import { io } from "socket.io-client";
export const socket=io("http://localhost:3000")

export const likeOrUnlikePost = (postId: string) => {
  return api.post(`/post/like/${postId}`)
  .then(() => console.log("Post liked/unliked successfully"))
  .catch(() => alert("Failed to like/unlike post"));
}