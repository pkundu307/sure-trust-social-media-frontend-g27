import { useState } from 'react';

const dummyChats = [
  {
    id: 1,
    name: 'John doe',
    messages: ['Hey!', 'How are you?', 'Let’s catch up!'],
  },
  {
    id: 2,
    name: 'jane smith',
    messages: ['Yo bro!', 'Check this meme 😂', 'Send me the notes'],
  },
];

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [selectedChat, setSelectedChat] = useState(dummyChats[0]);

  return (
    <div className="w-[320px] h-[400px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col z-50">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Chats</span>
        <button onClick={onClose} className="text-sm hover:text-red-400">✕</button>
      </div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Chat list */}
        <div className="w-1/3 border-r overflow-y-auto">
          {dummyChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                selectedChat.id === chat.id ? 'bg-gray-200' : ''
              }`}
            >
              {chat.name}
            </div>
          ))}
        </div>

        {/* Message View */}
        <div className="w-2/3 flex flex-col justify-between">
          <div className="p-2 flex-1 overflow-y-auto text-sm">
            {selectedChat.messages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-blue-100 mb-2 p-2 rounded-md text-gray-800 max-w-[80%]"
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="p-2 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;