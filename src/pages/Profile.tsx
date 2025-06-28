import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IUser } from "../types/user";
import type { Friend } from "../types/Friends";
import type { IPost } from "../types/post";
import { likeOrUnlikePost } from "../api/commonApis";

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);

  const fetchData = () => {
    api
      .get("/post/allofme")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));
    api
      .get("friendRequest/allfriends")
      .then((res) => setFriends(res.data))
      .catch(() => alert("Failed to load friends"));
  };
  useEffect(() => {
    fetchData();
    api
      .get("/user/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch user data");
      });
  }, []);

  function handleLike(postId: string) {
    likeOrUnlikePost(postId);
  }
  return user ? (
    <>
      <div className="bg-grey-100 min-h-screen ">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}

          <div className="bg-white shadow rounded-2xl p-6 mb-6">
            <h2 className="text-3xl font-bold mb-2">Welcome,{user.name}</h2>
            <p>
              <strong>Email:{user.email}</strong>
            </p>
            <p>
              <strong>BIO:{user.bio ? user.bio : "No BIO"}</strong>
            </p>
            <p>
              <strong>
                <button className="bg-orange-300 text-red-500 p-2 rounded shadow">
                  ✏️Edit
                </button>
              </strong>
            </p>
          </div>
          {/* layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}

            <div className="col-span-1 bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold mb-2">Friends</h3>
              {friends.length === 0 ? (
                <p>No Friends</p>
              ) : (
                <ul className="space-y-2">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded"
                    >
                      <span>{friend.name}</span>
                      <button className="bg-red-500 text-white font-bold rounded px-3 py-1">
                        Unfriend
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* posts */}
            <div className="col-span-3">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded shadow p-4 mb-4"
                >
                  <div className="font-bold text-lg">{post.user.name}</div>
                  <p className="mt-1">{post.text}</p>
                  {post.image && (
                    <img src={post.image} alt="" className="mt-2 rounded" />
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                  {/* total likes */}
                  <div className="flex space-x-6">
                    <div className="mt-2">
                      <button className="bg-blue-500 text-white font-bold rounded px-3 py-1 mr-2"
                      onClick={() => handleLike(post._id)}
                      >
                        👍
                      </button>
                      <span className="font-semibold">
                        {post.likes.length}{" "}
                        {post.likes.length > 1 ? "Likes" : "Like"}{" "}
                      </span>
                    </div>
                    <div className="mt-2">
                      <button className="bg-purple-500 text-white font-bold rounded px-3 py-1 mr-2">
                        💬
                      </button>
                      <span className="font-semibold">
                        {post.comments.length}{" "}
                        {post.comments.length > 1 ? "Comments" : "Comment"}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p>Loading profile</p>
  );
};

export default Profile;
