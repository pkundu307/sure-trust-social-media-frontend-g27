import React from "react";
import type { NotificationType } from "../types/Notification.ts";

const dummyNotifications: NotificationType[] = [
  {
    _id: "1",
    message: "John Doe liked your post",
    type: "like",
    sender: {
      _id: "101",
      name: "John Doe",
      profilePicture: "https://via.placeholder.com/40",
    },
    relatedPostId: "501",
    isRead: false,
    createdAt: "2025-07-21T10:00:00Z",
  },
  {
    _id: "2",
    message: "Jane Smith sent you a friend request",
    type: "friend_request",
    sender: {
      _id: "102",
      name: "Jane Smith",
      profilePicture: "https://via.placeholder.com/40",
    },
    relatedPostId: "",
    isRead: true,
    createdAt: "2025-07-20T09:00:00Z",
  },
];

const Notifications: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {dummyNotifications.map((notification) => (
          <li
            key={notification._id}
            className={`p-4 rounded-lg shadow ${
              notification.isRead ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={notification.sender.profilePicture}
                alt={notification.sender.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
