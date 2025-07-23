import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IPost } from "../types/post";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSideBar";
import { useNavigate } from "react-router-dom";
import { likeOrUnlikePost } from "../api/commonApis";
import { socket } from "../api/commonApis";
import { FaImage } from "react-icons/fa6";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [text, setText] = useState("");
  const [displayLikePopup, setDisplayLikePopup] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const handleSelectFile = (e) => setFile(e.target.files[0]);
  const navigate = useNavigate();


  useEffect(() => {
    api
      .get("/post/all")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));

    // ✅ Subscribe to post like updates
    socket.on("post_liked", ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    });

    return () => {
      socket.off("post_liked"); // 🔁 clean up listener
    };
  }, []);



  const handlePost = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/post/add", { text });
      setPosts([res.data, ...posts]);
      setText("");
    } catch {
      alert("Failed to create post");
    }
  };

const handleUpload = async () => {
  // Prevent submission if there's no text. The image is optional.
  if (!text) {
    alert("Post text cannot be empty.");
    return;
  }

  try {
    setLoading(true);
    
    // 1. Create a new FormData object
    const formData = new FormData();
    
    // 2. Append the text data. The key 'text' must match req.body.text.
    formData.append("text", text);

    // 3. Append the file IF it exists.
    // The key 'image' MUST match upload.single('image') in your backend route.
    if (file) {
      formData.append("image", file);
    }

    // 4. Retrieve the auth token
    // Replace this with your actual token retrieval logic (from context, localStorage, etc.)
    const token = localStorage.getItem("token"); 
    if (!token) {
        alert("You are not logged in.");
        setLoading(false);
        return;
    }

    // 5. Make the POST request to the correct endpoint with headers
    // The endpoint should be your new combined endpoint, not "/upload"
    const response = await axios.post(
      "http://localhost:3000/api/post/add", // <-- CORRECT ENDPOINT
      formData, 
      {
        headers: {
          // The browser will set 'Content-Type': 'multipart/form-data' automatically with FormData
          'Authorization': `Bearer ${token}` // <-- ADD AUTH TOKEN
        },
      }
    );

    // On success, you get the new post data back
    console.log("Post created successfully:", response.data);
    setRes(response.data); // Store the new post data
// setPosts([res.data, ...posts]);
  } catch (error) {
    // Better error handling
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error creating post:", errorMessage);
    alert(`Error: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date();
      const loginDate = new Date(loginTime);
      const timeDifference = currentTime.getTime() - loginDate.getTime();
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      if (minutesDifference > 60) {
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        handleLogout();
        alert("Session expired. Please log in again.");
      }
    }
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  }

  const handleLike = async (postId: string) => {
    try {
      await likeOrUnlikePost(postId);
    } catch (error) {
      console.log("error");
    }
  };

  const displayLikes = () => {
    setDisplayLikePopup(!displayLikePopup);
  };
  return (
    <>
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64 xl:mr-64 overflow-y-auto h-screen p-4 bg-gray-100">
          <div className="max-w-2xl mx-auto">
            {/* Stories */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">Stories</h2>
              <div className="flex space-x-4 overflow-x-auto">
                {[1, 2, 3].map((story, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-gradient-to-tr from-purple-400 to-blue-800 w-24 h-24 items-center justify-center text-white font-semibold text-sm"
                  >
                    Story{story}
                  </div>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <textarea
                className="w-full border border-gray-500 p-3 rounded-lg resize-none focus:ring-blue-600"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind"
              />
              <div className="App">
                <label htmlFor="file" className="btn-grey">
                  select file
                </label>
                {file && <center>{file.name}</center>}
                <input
                  id="file"
                  type="file"
                  onChange={handleSelectFile}
                  multiple={false}
                />
                <code>
                  {Object.keys(res).length > 0
                    ? Object.keys(res).map((key) => (
                        <p className="output-item" key={key}>
                          <span>{key}:</span>
                          <span>
                            {typeof res[key] === "object" ? "object" : res[key]}
                          </span>
                        </p>
                      ))
                    : null}
                </code>
                {file && (
                  <>
                    <button onClick={handleUpload} className="btn-green">
                      {loading ? "uploading..." : "upload to cloudinary"}
                    </button>
                  </>
                )}
              </div>
              <button
                className="mt-2 bg-blue-600 px-4 py-2 text-white rounded-lg"
                onClick={handleUpload}
              >
                Post
              </button>
            </div>

            {/* Posts */}
            {posts.map((post) => (
  <div className="bg-white rounded-xl shadow p-4 mb-6 relative" key={post._id}>

    {/* Post content */}
    <div className="font-bold text-lg text-gray-800">
      {post.user.name}
      <p className="mt-2 text-gray-700 font-semibold">{post.text}</p>
      {post.image && (
        <img
          src={post.image}
          
          className="mt-3 rounded-lg max-h-96 w-full object-cover"
        />
      )}
      <div className="text-sm text-gray-400 mt-2">
        {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="flex gap-6 items-center mt-4 text-sm font-medium">
        <div className="flex items-center gap-1">
          <button onClick={() => handleLike(post._id)}>👍</button>
          <span
            className="cursor-pointer text-gray-600"
            onClick={displayLikes}
          >
            {post.likes.length} {post.likes.length === 1 ? "Like" : "likes"}
          </span>
        </div>
      </div>
    </div>
  </div>
))}

          </div>
        </main>
        <RightSidebar />
      </div>
    </>
  );
};

export default Home;

//improvisation -> like , comment option , ui improvement, post image and video upload
