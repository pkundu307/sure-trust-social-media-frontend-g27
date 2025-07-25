import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IUser } from "../types/user";
import type { Friend } from "../types/Friends";
import type { IPost } from "../types/post";
import { likeOrUnlikePost } from "../api/commonApis";
import { NavLink } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { socket } from "../socket";

const Profile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200";
    const hover = "hover:bg-red-400";
    const active = "bg-rose-500 text-white font-bold";
    const inactive = "bg-rose-500 text-slate-900";
    return `${base} ${hover} ${isActive ? active : inactive}`;
  };

  const fetchData = () => {
    api.get("/post/allofme").then(res => setPosts(res.data)).catch(() => alert("Failed to load posts"));
    api.get("friendRequest/allfriends").then(res => setFriends(res.data)).catch(() => alert("Failed to load friends"));
    api.get("/user/me")
      .then(res => {
        setUser(res.data);
        setNewName(res.data.name || "");
        setNewBio(res.data.bio || "");
        socket.emit("setup", res.data._id); // join socket room
      })
      .catch(err => {
        console.error(err);
        alert("Failed to fetch user data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("post_liked", ({ postId, likes }: { postId: string; likes: string[] }) => {
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes } : p));
    });
    return () => socket.off("post_liked");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLike = (postId: string) => {
    if (user?._id) likeOrUnlikePost(postId, user._id);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="bg-grey-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative w-[120px] h-[120px]">
              <img
                src={profilePic || "/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-gray-300 shadow"
              />
              <label htmlFor="profile-pic-input" className="absolute bottom-1 right-1 bg-orange-400 p-1 rounded-full cursor-pointer shadow text-white text-xs">
                ✏️
              </label>
              <input
                type="file"
                id="profile-pic-input"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>BIO:</strong> {user.bio || "No BIO"}</p>
              <button
                className="bg-orange-300 text-red-500 p-2 rounded shadow mt-2"
                onClick={() => setShowEditModal(true)}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
          <NavLink to="/deleted-posts" className={getNavLinkClass}>
            <FaTrashAlt size={18} />
            Deleted Posts
          </NavLink>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Friends List */}
          <div className="col-span-1 bg-white p-4 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Friends</h3>
            {friends.length === 0 ? (
              <p>No Friends</p>
            ) : (
              <ul className="space-y-2">
                {friends.map(f => (
                  <li key={f._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span>{f.name}</span>
                    <button className="bg-red-500 text-white font-bold rounded px-3 py-1">
                      Unfriend
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Posts */}
          <div className="col-span-3">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded shadow p-4 mb-4 relative">
                {post.user._id === localStorage.getItem("userId") && (
                  <div className="absolute top-4 right-4 menu-container">
                    <button
                      className="text-gray-600 text-xl font-bold"
                      onClick={e => {
                        e.stopPropagation();
                        setOpenMenuId(prev => (prev === post._id ? null : post._id));
                      }}
                    >
                      ⋮
                    </button>
                    {openMenuId === post._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                          onClick={async () => {
                            try {
                              await api.put(`/post/softDelete/${post._id}`);
                              setPosts(prev => prev.filter(p => p._id !== post._id));
                              setOpenMenuId(null);
                            } catch {
                              alert("Failed to delete post");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="font-bold text-lg">{post.user.name}</div>
                <p className="mt-1">{post.text}</p>
                {post.image && <img src={post.image} className="mt-2 rounded" alt="" />}
                <div className="text-sm text-gray-500 mt-1">{new Date(post.createdAt).toLocaleString()}</div>

                <div className="flex space-x-6 mt-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${post.likes.includes(user._id) ? "bg-red-500" : "bg-blue-500"}`}
                    onClick={() => handleLike(post._id)}
                  >
                    👍 {post.likes.length}
                  </button>
                  <button className="bg-purple-500 text-white font-bold rounded px-3 py-1">
                    💬 {post.comments.length}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4 relative">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="New Username"
                className="w-full border p-2 rounded"
              />
              <textarea
                value={newBio}
                onChange={e => setNewBio(e.target.value)}
                placeholder="New Bio"
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {
                      await api.put("/user/me", {
                        name: newName,
                        bio: newBio,
                        email: user.email,
                      });
                      if (oldPassword && newPassword && confirmNewPassword) {
                        await api.put("/auth/change-password", {
                          oldPassword,
                          newPassword,
                          confirmNewPassword,
                        });
                      }
                      alert("Profile updated successfully");
                      setShowEditModal(false);
                      window.location.reload();
                    } catch (err: any) {
                      alert(err?.response?.data?.message || "Update failed");
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
