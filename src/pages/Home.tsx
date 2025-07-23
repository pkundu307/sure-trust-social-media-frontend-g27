import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { IPost } from "../types/post";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSideBar";
import { useNavigate } from "react-router-dom";
import { likeOrUnlikePost, socket } from "../api/commonApis";
<<<<<<< HEAD
=======
import { FaImage } from "react-icons/fa6";
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
import axios from "axios";
import StoriesComponent from "../components/Stories";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [text, setText] = useState("");
  const [displayLikePopup, setDisplayLikePopup] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [res, setRes] = useState<any>({});
=======
  const [res, setRes] = useState({});
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 

<<<<<<< HEAD
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const createLikeNotification = async(data:any,token:string)=>{
    try {
      const res = await axios.post(`http://localhost:3000/api/notification/create`,data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      return res.data;
    } catch (error) {
    console.error(error)
    }
  }
=======
  const handleSelectFile = (e) => setFile(e.target.files[0]);
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037

  useEffect(() => {
    api.get("/post/all")
      .then((res) => setPosts(res.data))
      .catch(() => alert("Failed to load posts"));

    socket.on("post_liked", ({ postId, likes }) => {
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

  const handleUpload = async () => {
<<<<<<< HEAD
    if (!text.trim()) {
=======
    if (!text) {
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
      alert("Post text cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", text);
<<<<<<< HEAD
      if (file) formData.append("image", file);
=======
      if (file) {
        formData.append("image", file);
      }
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/post/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

<<<<<<< HEAD
      setRes(response.data);
      setPosts([response.data, ...posts]);
      setText("");
      setFile(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
=======
      console.log("Post created successfully:", response.data);
      setRes(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Error creating post:", errorMessage);
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  };

=======
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
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
<<<<<<< HEAD
=======

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  }
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037

  const handleLike = async (postId: string,userId:string) => {
    try {

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await likeOrUnlikePost(postId, user._id);
      const data={recipient:userId,type:"like_post"}
      createLikeNotification(data,localStorage.getItem("token")||'')
    } catch (error) {
      console.log("error");
    }
  };

  const displayLikes = () => {
    setDisplayLikePopup(!displayLikePopup);
  };

  return (
<<<<<<< HEAD
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
                  className="rounded-full bg-gradient-to-tr from-purple-400 to-blue-800 w-24 h-24 flex items-center justify-center text-white font-semibold text-sm"
                >
                  Story {story}
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
            <div className="bg-white rounded-xl shadow p-4 mb-6 relative" key={post._id}>
              <div className="font-bold text-lg text-gray-800">
                {post.user.name}
                <p className="mt-2 text-gray-700 font-semibold">{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-3 rounded-lg max-h-96 w-full object-cover"
                  />
                )}
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-6 items-center mt-4 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleLike(post._id,post.user._id)}>👍</button>
                    <span
                      className="cursor-pointer text-gray-600"
                      onClick={displayLikes}
                    >
                      {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
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
=======
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
                    className="rounded-full bg-gradient-to-tr from-purple-400 to-blue-800 w-24 h-24 items-center justify-center text-white font-semibold text-sm flex items-center justify-center"
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
              <div
                className="bg-white rounded-xl shadow p-4 mb-6 relative"
                key={post._id}
              >
                <div className="font-bold text-lg text-gray-800">
                  {post.user.name}
                  <p className="mt-2 text-gray-700 font-semibold">
                    {post.text}
                  </p>
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
                        {post.likes.length}{" "}
                        {post.likes.length === 1 ? "Like" : "likes"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div >
          {userId && <RightSidebar userId={userId} />}
        </div>
      </div>
    </>
>>>>>>> 500653431469667b60277dfc33f9a300b53e1037
  );
};

export default Home;
