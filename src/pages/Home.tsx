import { useEffect, useState } from 'react';
import {api} from '../api/axios';
import type{ IPost } from '../types/post';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSideBar';
import { useNavigate } from 'react-router-dom';
import { likeOrUnlikePost } from '../api/commonApis';

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [text, setText] = useState('');
  const [displayLikePopup, setDisplayLikePopup] = useState(false);


    const navigate = useNavigate();
  useEffect(() => {
    api.get('/post/all')
      .then((res) => setPosts(res.data))
      .catch(() => alert('Failed to load posts'));
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post('/post/add', { text });
      setPosts([res.data, ...posts]);
      setText('');
    } catch {
      alert('Failed to create post');
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
        handleLogout()      
          alert("Session expired. Please log in again.");
      }
    }
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  }

    function handleLike(postId: string) {
      likeOrUnlikePost(postId);
    }

  const displayLikes = () => {
    setDisplayLikePopup(!displayLikePopup);
  }
  return (
    <>
      
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Feed */}
        <div className="flex-1 p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded shadow p-4 mb-6">
         
            <h2 className="text-xl font-bold mb-4">Stories</h2>
            <div className="flex space-x-4 overflow-x-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">Story 1</span>
                </div>
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">Story 2</span>
                </div>
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">Story 3</span>
                </div>
                </div>
          </div>
          <div className="bg-white rounded shadow p-4 mb-6">
            <textarea
              className="w-full border p-2 rounded"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
            />
            <button
              onClick={handlePost}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post
            </button>
          </div>

          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded shadow p-4 mb-4">
              <div className="font-bold text-lg">{post.user.name}</div>
              <p className="mt-1">{post.text}</p>
              {post.image && <img src={post.image} alt="" className="mt-2 rounded" />}
              <div className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="flex space-x-6">
                    <div className="mt-2">
                      <button className="bg-blue-500 text-white font-bold rounded px-3 py-1 mr-2"
                      onClick={() => handleLike(post._id)}
                      >
                        👍
                      </button>
                      <span className="font-semibold" onClick={displayLikes}>
                        {post.likes.length}{" "}
                        {post.likes.length > 1 ? "Likes" : "Like"}{" "}
                        {displayLikePopup && (
                          <div className="absolute bg-white shadow-lg rounded p-4 mt-2">
                            <button onClick={()=>{displayLikes(); console.log(displayLikePopup)}}>❌</button>
                            <h3 className="font-bold mb-2">Liked by:</h3>
                            <ul>
                              {/* some dummy data} */}
                              <p>john</p>
                              <p>gary</p>
                              </ul>
                          </div>
                        )}
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

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </>
  );
};

export default Home;

//improvisation -> like , comment option , ui improvement, post image and video upload
