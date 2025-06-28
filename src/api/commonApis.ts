import { api } from "./axios";



export const likeOrUnlikePost = (postId: string) => {
  return api.post(`/post/like/${postId}`)
  .then(() => alert("Post liked/unliked successfully"))
  .catch(() => alert("Failed to like/unlike post"));
}