import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";

// This should be your real socket instance
import { io, Socket } from "socket.io-client";

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

// Assume you have a socket instance exported from a file
// It's better to initialize it once and export it.
const socket: Socket = io("http://localhost:3000");

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const currentUserId = localStorage.getItem("userId") || "";

  // Ref to hold the current selected user to avoid stale state in socket listeners
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // --- EFFECT 1: One-time setup for friends list and socket connection ---
  useEffect(() => {
    // Fetch friends only once when the component mounts
    api
      .get("/friendRequest/allfriends")
      .then((res) => setFriends(res.data))
      .catch(() => alert("Failed to load friends"));

    // Set up the socket connection for this user only once
    if (currentUserId) {
      socket.emit("setup", currentUserId);
    }

    // The main listener for incoming messages
    const handleReceiveMessage = (newMessage: Message) => {
      // Check if the message belongs to the currently active chat window
      const isChatActive =
        selectedUserRef.current?._id === newMessage.sender._id;

      if (isChatActive) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // Optional: Handle notifications for inactive chats
        console.log(
          `Received message from ${newMessage.sender.name}, but chat is not active.`
        );
        // You could update a 'hasNewMessage' state for the friend list here
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUserId]); // This effect should only run once when the component mounts.

  // --- EFFECT 2: Fetch message history when a user is selected ---
  useEffect(() => {
    if (selectedUser) {
      // **IMPORTANT**: You need to create this API endpoint on your backend.
      // It should fetch all messages between the current user and the selected user.
      // For now, we'll just clear messages.
      /*
      api.get(`/api/messages/${selectedUser._id}`) // Example endpoint
        .then(res => {
          setMessages(res.data);
        })
        .catch(() => {
          alert('Failed to load message history.');
          setMessages([]); // Clear on failure
        });
      */
      // For now, we just clear the chat window
      setMessages([]);
    }
  }, [selectedUser]); // Reruns whenever you select a new friend

  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    const payload = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: text,
    };

    socket.emit("send_message", payload);

    // Optimistic UI Update: Add the message immediately to the UI
    // We create a temporary message object that matches our `Message` interface
    const optimisticMessage: Message = {
      _id: `temp_${Date.now()}`, // temporary unique ID
      sender: { _id: currentUserId, name: "You" }, // We know the sender is the current user
      receiver: selectedUser._id,
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");
  };

  return (
    <div className="w-[320px] h-[400px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col z-50">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">
          {selectedUser ? selectedUser.name : "Chats"}
        </span>
        <button onClick={onClose} className="text-sm hover:text-red-400">
          ✕
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Friends list */}
        <div className="w-1/3 border-r overflow-y-auto text-sm">
          {friends.map((user: any) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {user.name}
            </div>
          ))}
        </div>

        {/* Message View */}
        <div className="w-2/3 flex flex-col">
          <div className="p-3 flex-1 overflow-y-auto text-sm space-y-3">
            {/* Render message history only if a user is selected */}
            {selectedUser ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    // Check if the message was sent by the current user
                    msg.sender._id === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[85%] ${
                      msg.sender._id === currentUserId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {/* For better UX, you can show sender name on received messages */}
                    {msg.sender._id !== currentUserId && (
                      <p className="text-xs font-bold text-gray-600">
                        {msg.sender.name}
                      </p>
                    )}
                    <p className="break-words">{msg.content.startsWith('img')?(<><img src={msg.content.slice(3)}/></>):(<>{msg.content}</>)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a friend to start chatting.
              </div>
            )}
          </div>

          {/* Input field is only active if a user is selected */}
          {selectedUser && (
            <div className="p-2 border-t flex gap-1">
              <button className="bg-amber-100 p-2"
              onClick={() => (setText('img'+text))}
              >Img</button>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
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
