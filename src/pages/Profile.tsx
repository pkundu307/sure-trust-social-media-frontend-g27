import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IUser } from "../types/user";
import type { Friend } from "../types/Friends";
import type { IPost } from "../types/post";
import { likeOrUnlikePost } from "../api/commonApis";
import { NavLink } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { socket } from "../api/commonApis"; // Corrected import path assuming it's in commonApis

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

  // FIX 1: Corrected template literal syntax
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200";
    const hover = "hover:bg-red-400";
    const active = "bg-rose-500 text-white font-bold";
    const inactive = "bg-rose-500 text-slate-900"; // Or your preferred inactive style
    return `${base} ${hover} ${isActive ? active : inactive}`;
  };

  const fetchData = () => {
    api.get("/api/post/allofme").then((res) => setPosts(res.data)).catch(() => alert("Failed to load posts"));
    api.get("/api/friendRequest/allfriends").then((res) => setFriends(res.data)).catch(() => alert("Failed to load friends"));
    api.get("/api/user/me").then((res) => {
      setUser(res.data);
      setNewName(res.data.name || "");
      setNewBio(res.data.bio || "");
      setProfilePic(res.data.profilePicture?.url||"")
    }).catch((err) => {
      console.error(err);
      alert("Failed to fetch user data");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("post_liked", ({ postId, likes }: { postId: string; likes: string[] }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    });
    return () => {
      socket.off("post_liked");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleLike(postId: string) {
    if (user?._id) {
      likeOrUnlikePost(postId, user._id);
    }
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
      setFile(file)


    }
  };
const updatePP = async () => {
    // formData is likely defined outside this function and being reused
    const token = localStorage.getItem("token");
    if (file) {
        formData.append("image", file); // Appending to an existing object
    }
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/user/me/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        
      
}


  return user ? (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* FIX 2: Resolved duplicated and badly structured header into one clean component */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <img
                src={profilePic || user.profilePic || "/default-profile.png"} // Use state for preview, fallback to user data
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-rose-500 shadow-md"
              />
              <label htmlFor="profile-pic-input" className="absolute bottom-1 right-1 bg-rose-500 p-2 rounded-full cursor-pointer shadow text-white hover:bg-rose-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
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
              <h2 className="text-3xl font-bold mb-1">Welcome, {user.name}</h2>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-600 mt-1"><strong>Bio:</strong> {user.bio || "No bio set."}</p>
              <button
                className="bg-rose-100 text-rose-600 font-semibold px-4 py-2 rounded-lg shadow-sm mt-3 hover:bg-rose-200 transition-colors"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div>
            <NavLink to="/deleted-posts" className={getNavLinkClass}>
              <FaTrashAlt size={18} />
              Deleted Posts
            </NavLink>
          </div>
        </div>

        {/* FIX 3: Resolved duplicated grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Friends</h3>
            {friends.length === 0 ? (
              <p className="text-gray-500">You have no friends yet.</p>
            ) : (
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend._id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                    <span className="font-medium">{friend.name}</span>
                    <button className="bg-red-500 text-white font-bold rounded px-3 py-1 text-sm hover:bg-red-600">Unfriend</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-1 lg:col-span-3">
            {posts.map((post) => (
              // FIX 4: Merged duplicated post item into a single, cohesive component
              <div key={post._id} className="bg-white rounded-lg shadow p-4 mb-4 relative">
                {post.user._id === user._id && (
                  <div className="absolute top-4 right-4 menu-container">
                    <button
                      className="text-gray-600 text-2xl font-bold hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        // FIX 5: Simplified state update
                        setOpenMenuId(prev => prev === post._id ? null : post._id);
                      }}
                    >⋮</button>
                    {openMenuId === post._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-xl z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                          onClick={async () => {
                            try {
                              // FIX 6: Corrected API call string
                              await api.put(`/post/softDelete/${post._id}`);
                              setPosts(posts.filter((p) => p._id !== post._id));
                              alert("Post moved to trash");
                              setOpenMenuId(null);
                            } catch (err) {
                              console.error(err);
                              alert("Failed to delete post");
                            }
                          }}
                        >Delete</button>
                      </div>
                    )}
                  </div>
                )}
                <div className="font-bold text-lg">{post.user.name}</div>
                <p className="mt-1 text-gray-800">{post.text}</p>
                {post.image && <img src={post.image} alt="Post content" className="mt-3 rounded-lg w-full object-cover" />}
                <div className="text-sm text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</div>
                <div className="flex items-center space-x-6 mt-3 border-t pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-white font-bold transition-colors ${
                        post.likes.includes(user._id)
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => handleLike(post._id)}
                    >👍</button>
                    <span className="font-semibold text-gray-700">{post.likes.length} {post.likes.length !== 1 ? "Likes" : "Like"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-gray-300 text-white font-bold rounded-full px-3 py-1 hover:bg-gray-400">💬</button>
                    <span className="font-semibold text-gray-700">{post.comments.length} {post.comments.length !== 1 ? "Comments" : "Comment"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FIX 7: Cleaned up modal logic and removed duplicate buttons */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
              <h2 className="text-2xl font-bold border-b pb-2">Edit Profile</h2>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Username" className="w-full border p-2 rounded-md" />
              <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="New Bio" className="w-full border p-2 rounded-md" />
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current Password (for change)" className="w-full border p-2 rounded-md" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full border p-2 rounded-md" />
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" className="w-full border p-2 rounded-md" />
              <div className="flex justify-end space-x-3 pt-4">
                <button className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={handleUpdateProfile}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <p className="text-center text-lg mt-10">Loading profile...</p>
  );
};

export default Profile;