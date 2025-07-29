import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IPost } from "../types/post";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSideBar";

const DeletedPosts = () => {
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([]);

  useEffect(() => {
    api
      .get("/api/post/deleted")
      .then((res) => setDeletedPosts(res.data))
      .catch(() => alert("Failed to load deleted posts"));
  }, []);

  const handleRestore = async (postId: string) => {
    try {
      await api.put(`/post/restore/${postId}`);
      setDeletedPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post restored successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to restore post");
    }
  };

  const handlePermanentDelete = async (postId: string) => {
    try {
      await api.delete(`/post/${postId}`);
      setDeletedPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post permanently deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="flex">
      <LeftSidebar />
      <main className="flex-1 lg:ml-64 xl:mr-64 overflow-y-auto h-screen p-4 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Deleted Posts</h2>
          {deletedPosts.length === 0 ? (
            <p className="text-center text-gray-500">No deleted posts.</p>
          ) : (
            deletedPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow p-4 mb-6"
              >
                <div className="font-bold text-lg text-gray-800">
                  {post.user.name}
                </div>
                <p className="mt-2 text-gray-700 font-semibold">{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-3 rounded-lg max-h-96 w-full object-cover"
                  />
                )}
                <div className="text-sm text-gray-500 mt-2">
                  Deleted Around:{" "}
                  {post.updatedAt
                    ? new Date(post.updatedAt).toLocaleString()
                    : "Unknown"}
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleRestore(post._id)}
                  >
                    Restore
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handlePermanentDelete(post._id)}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
};

export default DeletedPosts;
