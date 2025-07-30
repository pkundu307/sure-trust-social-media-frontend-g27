import React, { useState, useEffect, useRef, FC } from 'react';
import { Camera, Plus, X, Play, Eye, Clock, Users, RefreshCw } from 'lucide-react';

// --- UPDATED TYPE DEFINITIONS to match the new API response ---

// Client-side User object (what the component uses)
interface User {
  id: string;
  name: string;
  avatar: string; // The component UI requires an avatar
}

// Client-side Story object (what the component uses)
interface Story {
  id: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  viewers: string[];
}

// Type for the raw User object from the API
interface ApiUser {
  _id: string;
  name: string;
  email?: string;
  // The API user object doesn't have avatar directly
}

// Type for profile picture from API
interface ProfilePicture {
  url: string;
}

// Type for the raw Story object from the API
interface ApiStory {
  _id: string;
  user: ApiUser;
  image: string; // The API uses 'image' field for the media URL
  viewers: string[];
  createdAt: string;
  isActive: boolean;
  profilePicture?: ProfilePicture; // Optional since it might not always be present
}

interface StoriesState {
  unwatched: Story[];
  watched: Story[];
}

interface StoryCircleProps {
  story?: Story;
  isUpload?: boolean;
  isWatched?: boolean;
  onStoryClick: (story: Story) => void;
  onUploadClick: () => void;
}

const StoriesComponent: FC = () => {
  const [stories, setStories] = useState<StoriesState>({
    unwatched: [],
    watched: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUser] = useState<User>({
    id: 'user123',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });
  
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/story`;

  // --- FIXED TRANSFORMATION FUNCTION ---
  const transformApiStory = (apiStory: ApiStory): Story => {
    // Default avatar fallback
    const defaultAvatar = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop&crop=face';
    
    // Get avatar from profilePicture field at story level, or use default
    const avatarUrl = apiStory.profilePicture?.url || defaultAvatar;
    
    return {
      id: apiStory._id,
      mediaUrl: apiStory.image, // Map 'image' from API to 'mediaUrl' for the component
      mediaType: 'image', // Assume 'image' since API doesn't specify type
      viewers: apiStory.viewers,
      createdAt: new Date(apiStory.createdAt),
      user: {
        id: apiStory.user._id, // Map '_id' from API to 'id'
        name: apiStory.user.name,
        avatar: avatarUrl, // Use the profilePicture from story level
      }
    };
  };

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stories');
      
      // 1. Correctly type the response as an array of ApiStory
      const apiStories: ApiStory[] = await response.json();
      
      // 2. Categorize stories into 'unwatched' and 'watched' on the client side
      const categorizedStories = apiStories.reduce<StoriesState>((acc, apiStory) => {
        // First, transform the story from the API format to the component's format
        const story = transformApiStory(apiStory);

        // Check if the current user has already viewed this story
        const isWatched = story.viewers.includes(currentUser.id);

        if (isWatched) {
          acc.watched.push(story);
        } else {
          acc.unwatched.push(story);
        }

        return acc;
      }, { unwatched: [], watched: [] });

      // 3. Set the state with the correctly categorized stories
      setStories(categorizedStories);

    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories({ unwatched: [], watched: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (viewingStory) {
      timer = setTimeout(() => setViewingStory(null), 5000);
    }
    return () => clearTimeout(timer);
  }, [viewingStory]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const newApiStory: ApiStory = await response.json();
      
      const transformedStory = transformApiStory(newApiStory);
      
      setStories(prev => ({ ...prev, unwatched: [transformedStory, ...prev.unwatched] }));
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error uploading story:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStoryClick = async (story: Story) => {
    setViewingStory(story);

    if (!story.viewers.includes(currentUser.id)) {
      const updatedStory = { ...story, viewers: [...story.viewers, currentUser.id] };

      setStories(prev => ({
        unwatched: prev.unwatched.filter(s => s.id !== story.id),
        watched: [updatedStory, ...prev.watched.filter(s => s.id !== story.id)]
      }));
      
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/mark-watched/${story.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error marking story as watched:', error);
      }
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const StoryCircle: FC<StoryCircleProps> = ({ story, isUpload = false, isWatched = false, onStoryClick, onUploadClick }) => {
    const borderClass = isUpload 
      ? 'border-2 border-dashed border-gray-300 hover:border-blue-400' 
      : isWatched 
        ? 'border-2 border-gray-300'
        : 'border-4 border-transparent bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 p-0.5';
    
    const handleClick = () => {
        if (isUpload) onUploadClick();
        else if (story) onStoryClick(story);
    }

    return (
      <div className="flex flex-col items-center space-y-2 min-w-20">
        <div className={`relative w-20 h-20 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${borderClass}`} onClick={handleClick}>
          {isUpload ? (
            <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          ) : story ? (
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img 
                src={story.user.avatar} 
                alt={story.user.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop&crop=face';
                }}
              />
              {!isWatched && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full" />}
            </div>
          ) : null}
          {!isUpload && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
              {isWatched ? <Eye className="w-3 h-3 text-gray-400" /> : <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-600 text-center max-w-16 truncate">
          {isUpload ? 'Your Story' : story?.user.name}
        </span>
        {!isUpload && story && (
          <span className="text-xs text-gray-400">{getTimeAgo(story.createdAt)}</span>
        )}
      </div>
    );
  };
  
  const StoryViewerModal: FC = () => {
    if (!viewingStory) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setViewingStory(null)}>
            <div className="relative w-full max-w-md h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-progress"></div>
                </div>
                <div className="absolute top-5 left-4 flex items-center space-x-3 z-10">
                    <img 
                      src={viewingStory.user.avatar} 
                      alt={viewingStory.user.name} 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop&crop=face';
                      }}
                    />
                    <span className="text-white font-semibold">{viewingStory.user.name}</span>
                    <span className="text-white/70 text-sm">{getTimeAgo(viewingStory.createdAt)}</span>
                </div>
                <button onClick={() => setViewingStory(null)} className="absolute top-5 right-4 text-white/80 hover:text-white z-10">
                  <X size={28} />
                </button>
                {viewingStory.mediaType === 'image' ? (
                    <img src={viewingStory.mediaUrl} alt="Story" className="w-full h-full object-cover"/>
                ) : (
                    <video src={viewingStory.mediaUrl} className="w-full h-full object-cover" autoPlay playsInline onEnded={() => setViewingStory(null)}></video>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Stories</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchStories} 
            disabled={isLoading} 
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>New</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Watched</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 min-w-20">
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            <StoryCircle 
              isUpload={true} 
              onUploadClick={() => fileInputRef.current?.click()} 
              onStoryClick={() => {}} 
            />
            {stories.unwatched.map((story) => (
              <StoryCircle 
                key={story.id} 
                story={story} 
                isWatched={false} 
                onStoryClick={handleStoryClick} 
                onUploadClick={() => {}} 
              />
            ))}
            {stories.watched.map((story) => (
              <StoryCircle 
                key={story.id} 
                story={story} 
                isWatched={true} 
                onStoryClick={handleStoryClick} 
                onUploadClick={() => {}} 
              />
            ))}
          </div>
        )}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{stories.unwatched.length} new stories</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{stories.watched.length} watched today</span>
        </div>
      </div>

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Upload Story</h3>
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {previewUrl && (
              <div className="mb-4">
                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg"/>
              </div>
            )}
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload} 
                disabled={isUploading} 
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Share Story</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <StoryViewerModal />

      <style jsx>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes progress-bar { from { width: 0%; } to { width: 100%; } }
        .animate-progress { animation: progress-bar 5s linear forwards; }
      `}</style>
    </div>
  );
};

export default StoriesComponent;