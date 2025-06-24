import { useEffect, useState } from 'react';
import {api} from '../api/axios';
import type{ IPost } from '../types/post';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSideBar';

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [text, setText] = useState('');

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
