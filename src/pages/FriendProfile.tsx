// src/types/profile.ts (or at the top of your component file)

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios'; // Your configured axios instance

interface IProfilePicture {
  url: string;
  public_id: string;
}

interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string; // Bio can be an empty string or not present
  profilePicture: IProfilePicture;
  followers: string[];
  following: string[];
  updatedAt: string;
}

interface IPostUser {
  _id: string;
  name: string;
  profilePicture: IProfilePicture;
}

interface IPost {
  _id: string;
  user: IPostUser;
  text: string;
  image?: string | null; // Image can be a URL, an empty string, or null
  likes: string[];
  comments: any[]; // Define a proper IComment interface if you have comment data
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// This interface represents the entire API response
export interface IProfileApiResponse {
  user: IUserProfile;
  posts: IPost[];
}

// --- Icon Imports (requires react-icons) ---
// npm install react-icons
import { FaThumbsUp, FaCommentDots, FaUserPlus, FaUserCheck } from 'react-icons/fa';

const FriendProfile = () => {
  // Get the email from the URL, e.g., /profile/test1@gmail.com
  // const { email } = useParams<{ email: string }>();
   const { id } = useParams();
  const [profileData, setProfileData] = useState<IProfileApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // A placeholder for the current logged-in user's ID
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) {
      setError("No user email specified in URL.");
      setLoading(false);
      return;
    }

    const fetchFriendProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<IProfileApiResponse>(`/api/friends/profile-by-email?email=${id}`);
        setProfileData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch friend profile. The user may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [id]); // Re-fetch if the email in the URL changes

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading profile...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">{error}</p></div>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">No profile data found.</p></div>;
  }

  const { user, posts } = profileData;
  const isFollowing = user.followers.includes(currentUserId || '');

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        
        {/* --- Profile Header --- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.profilePicture?.url || ''}
            alt={`Profile of ${user.name}`}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-rose-500 shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-md text-gray-500 mt-1">{user.email}</p>
            {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
            <div className="flex justify-center md:justify-start gap-6 mt-4">
              <div className="text-center">
                <p className="text-xl font-bold">{posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user.followers.length}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">{user.following.length}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
             {/* Simple Follow/Unfollow button logic */}
            <button 
              className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow transition-colors duration-200 ${
                isFollowing 
                ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' 
                : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* --- Posts Grid --- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              <p>{user.name} hasn't posted anything yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};


// --- Post Card Component ---
// For better organization, this could be in its own file: `components/PostCard.tsx`
const PostCard = ({ post }: { post: IPost }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {post.image && (
        <img 
          src={post.image} 
          alt="Post content" 
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-gray-800 mb-4 flex-grow">{post.text}</p>
        <div className="border-t pt-3 mt-auto">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <FaThumbsUp className="text-blue-500" /> {post.likes.length}
              </span>
              <span className="flex items-center gap-1.5">
                <FaCommentDots className="text-purple-500" /> {post.comments.length}
              </span>
            </div>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FriendProfile;