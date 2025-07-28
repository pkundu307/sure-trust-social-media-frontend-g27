import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import { io, Socket } from "socket.io-client";
import { Image as ImageIcon } from "lucide-react"; // Import an icon for the button

// Define a more robust type for our messages
interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: string; // receiver is just an ID from the backend model
  content: string;
  createdAt: string;
}

const socket: Socket = io(`${import.meta.env.VITE_BASE_URL}`);

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State for upload feedback
  const currentUserId = localStorage.getItem("userId") || "";
  
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const selectedUserRef = useRef(selectedUser);
  
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // --- EFFECT 1: One-time setup for friends list and socket connection ---
  useEffect(() => {
    api.get("/api/friendRequest/allfriends")
      .then((res) => setFriends(res.data))
      .catch(() => alert("Failed to load friends"));

    if (currentUserId) {
      socket.emit("setup", currentUserId);
    }

    const handleReceiveMessage = (newMessage: Message) => {
      // If the received message is for the active chat, update the UI
      if (selectedUserRef.current?._id === newMessage.sender._id || selectedUserRef.current?._id === newMessage.receiver) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        console.log(`Received message from ${newMessage.sender.name}, but chat is not active.`);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUserId]);

  // --- EFFECT 2: Fetch message history when a new user is selected ---
  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true); // Show loading state for messages
      setMessages([]); // Clear previous messages

      api.get(`/api/chat/${selectedUser._id}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch(() => {
          alert("Failed to load messages.");
          setMessages([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedUser]);

  // --- Handler for sending TEXT messages ---
  const handleSendText = () => {
    if (!text.trim() || !selectedUser) return;

    const payload = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: text,
    };

    socket.emit("send_message", payload);

    const optimisticMessage: Message = {
      _id: `temp_${Date.now()}`,
      sender: { _id: currentUserId, name: "You" },
      receiver: selectedUser._id,
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");
  };

  // --- Handler for sending PHOTO messages ---
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    // Read the file as a data URL (which includes the base64 string)
    reader.readAsDataURL(file);

    reader.onload = () => {
      // The result looks like "data:image/jpeg;base64,LzlqLzRB..."
      const base64String = (reader.result as string).split(',')[1];

      const payload = {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        fileData: base64String,
        fileType: file.type,
      };

      // Emit the new event for photo messages
      socket.emit("send_photo_message", payload);
      
      // Optimistic UI update for the image
      const optimisticImageMessage: Message = {
        _id: `temp_img_${Date.now()}`,
        sender: { _id: currentUserId, name: "You" },
        receiver: selectedUser._id,
        content: `img+${reader.result}`, // Use the full data URI for instant preview
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticImageMessage]);
      setIsUploading(false);
    };

    reader.onerror = () => {
      console.error("Error reading the file.");
      alert("Failed to read file.");
      setIsUploading(false);
    };
  };

  // Helper to render message content (text or image)
  const renderMessageContent = (content: string) => {
    if (content.startsWith("img+")) {
      // Correctly split the "img+" prefix to get the URL or data URI
      const imageUrl = content.split('+').slice(1).join('+');
      return <img src={imageUrl} alt="chat content" className="max-w-full h-auto rounded-md" />;
    }
    return <p className="break-words">{content}</p>;
  };

  return (
    <div className="w-[320px] h-[400px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col z-50">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">{selectedUser ? selectedUser.name : "Chats"}</span>
        <button onClick={onClose} className="text-sm hover:text-red-400">✕</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Friends list */}
        <div className="w-1/3 border-r overflow-y-auto text-sm">
          {friends.map((user: any) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? "bg-gray-200 font-bold" : ""}`}
            >
              {user.name}
            </div>
          ))}
        </div>

        {/* Message View */}
        <div className="w-2/3 flex flex-col">
          <div className="p-3 flex-1 overflow-y-auto text-sm space-y-3">
            {selectedUser ? (
              isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender._id === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`rounded-lg px-3 py-2 max-w-[85%] ${msg.sender._id === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                      {msg.sender._id !== currentUserId && <p className="text-xs font-bold text-gray-600">{msg.sender.name}</p>}
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Select a friend to start chatting.</div>
            )}
          </div>

          {/* Input field is only active if a user is selected */}
          {selectedUser && (
            <div className="p-2 border-t flex gap-1 items-center">
              {/* --- NEW: Hidden file input and button to trigger it --- */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                {isUploading ? "..." : <ImageIcon size={20} />}
              </button>
              
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                disabled={isUploading}
              />
              <button
                onClick={handleSendText}
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
                disabled={isUploading}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;