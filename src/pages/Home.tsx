import { useEffect, useState } from "react";
import { api } from "../api/axios";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSideBar";
import { useNavigate } from "react-router-dom";
import { socket } from "../api/commonApis"; // Only socket is needed here now
import axios from "axios";
import Post from "../components/Post"; // Import the new Post component
import StoriesComponent from "../components/Stories";

// IUser interface
interface IUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

// IComment interface (still needed for IPost)
interface IComment {
  _id: string;
  user: IUser;
  text: string;
  createdAt: string;
}

// IPost interface
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

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const currentUser: IUser | null = userId
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    api.get("/api/post/all")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));

    // Socket listeners for real-time updates
    socket.on("post_liked", ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    });

    socket.on("new_comment", ({ postId, comments }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments } : post
        )
      );
    });

    return () => {
      socket.off("post_liked");
      socket.off("new_comment");
    };
  }, []);

  const handleUpload = async () => {
    if (!text.trim()) {
      alert("Post text cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("image", file);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts([response.data, ...posts]);
      setText("");
      setFile(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date();
      const loginDate = new Date(loginTime);
      const timeDifference = currentTime.getTime() - loginDate.getTime();
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      if (minutesDifference > 60) {
        handleLogout();
        alert("Session expired. Please log in again.");
      }
    }
  }, []);

  return (
    <div className="flex">
      <LeftSidebar />
      <main className="flex-1 lg:ml-64 xl:mr-64 overflow-y-auto h-screen p-4 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          {/* Stories */}
          {/* <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Stories</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {[1, 2, 3].map((story, i) => (
                <div
                  key={i}
                  className="rounded-full bg-gradient-to-tr from-purple-400 to-blue-800 w-24 h-24 flex items-center justify-center text-white font-semibold text-sm"
                >
                  Story {story}
                </div>
              ))}
            </div>
          </div> */}
<StoriesComponent/>
          {/* Create Post */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <textarea
              className="w-full border border-gray-500 p-3 rounded-lg resize-none focus:ring-blue-600"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
            />

            <div className="my-2">
              <label htmlFor="file" className="btn-grey cursor-pointer">
                Select File
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleSelectFile}
              />
              {file && <p className="text-center mt-2">{file.name}</p>}
            </div>

            <button
              onClick={handleUpload}
              className="mt-2 bg-blue-600 px-4 py-2 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Post"}
            </button>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              currentUser={currentUser}
              setPosts={setPosts}
            />
          ))}
        </div>
      </main>
      {userId && <RightSidebar userId={userId} />}
    </div>
  );
};

export default Home;