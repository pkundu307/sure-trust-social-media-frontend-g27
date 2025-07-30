import React, { useState } from "react";
import axios from "axios";
import { likeOrUnlikePost, socket } from "../api/commonApis"; // Ensure this path is correct

// IUser interface
interface IUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

// IComment interface
interface IComment {
  _id: string;
  user: IUser;
  text: string;
  createdAt: string;
}

// IPost interface (re-defined here for clarity in the component)
interface IPost {
  _id: string;
  user: IUser;
  text: string;
  image?: string;
  likes: string[];
  comments: IComment[];
  createdAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}

interface PostProps {
  post: IPost;
  currentUser: IUser | null;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const Post: React.FC<PostProps> = ({ post, currentUser, setPosts }) => {
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

    const handleLike = async (postId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await likeOrUnlikePost(postId, user._id);
    } catch (error) {
      console.log("Like error:", error);
    }
  };

  const handleComment = async (postId: string) => {
    const commentContent = commentText.trim();
    if (!commentContent) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/comment/${postId}`,
        { text: commentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText(""); // Clear comment input after successful post
      // Optimistically update comments or refetch if necessary
      // For real-time updates, the socket listener in Home.tsx will handle it.
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error: ${errorMessage}`);
    }
  };

  const toggleShowAllComments = () => {
    setShowAllComments((prevState) => !prevState);
  };

  const displayLikes = () => {
    // Implement logic to show who liked the post, e.g., a modal or tooltip
    alert(`Liked by: ${post.likes.length} users`); // Placeholder for now
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="flex items-center mb-2">
        {post.user.profilePicture ? (
          <img
            src={post.user.profilePicture}
            alt={`${post.user.name}'s profile`}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-sm font-semibold">
            {post.user.name.charAt(0)}
          </div>
        )}
        <div className="font-bold text-lg text-gray-800">
          {post.user.name}
        </div>
      </div>

      <p className="mt-2 text-gray-700 font-semibold">{post.text}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="mt-3 rounded-lg max-h-96 w-full object-cover"
        />
      )}
      <div className="text-sm text-gray-400 mt-2">
        {new Date(post.createdAt).toLocaleDateString()}
      </div>

       {/* Like + Comment */}
                <div className="flex gap-4 items-center mt-4 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleLike(post._id)}>👍</button>
                    <span
                      className="cursor-pointer text-gray-600"
                      onClick={displayLikes}
                    >
                      {post.likes.length}{" "}
                      {post.likes.length === 1 ? "Like" : "Likes"}
                    </span>
                  </div>


        <div className="flex items-center gap-1 text-gray-600">
          👁️‍🗨️
          <span>
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4 border-t pt-4">
        {post.comments.length > 0 && (
          <>
            {post.comments.length > 2 && !showAllComments && (
              <button
                onClick={toggleShowAllComments}
                className="text-blue-600 text-sm mb-2"
              >
                View all {post.comments.length} comments
              </button>
            )}

            {post.comments
              .slice(0, showAllComments ? post.comments.length : 2)
              .map((comment: IComment) => (
                <div key={comment._id} className="flex items-start mb-2">
                  {comment.user.profilePicture ? (
                    <img
                      src={comment.user.profilePicture}
                      alt={`${comment.user.name}'s profile`}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-xs font-semibold">
                      {comment.user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-gray-800 mr-1">
                      {comment.user.name}
                    </span>
                    <span className="text-gray-700">{comment.text}</span>
                    <div className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            {post.comments.length > 2 && showAllComments && (
              <button
                onClick={toggleShowAllComments}
                className="text-blue-600 text-sm mt-2"
              >
                Show less
              </button>
            )}
          </>
        )}

        {/* Comment Input */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={() => handleComment(post._id)}
            className="text-blue-600 font-semibold text-sm py-2 px-3 rounded-full hover:bg-blue-50 transition-colors"
            disabled={!commentText.trim()}
          >
            ⏩
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;