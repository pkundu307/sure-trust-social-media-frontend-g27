import React, { useEffect, useState } from "react";
import type { NotificationType } from "../types/Notification.ts";
import LeftSidebar from "../components/LeftSidebar.tsx";
import { api } from "../api/axios.ts";



const Notifications: React.FC = () => {
  const[notifications,setNotifications] = useState<NotificationType[]>([]);
  useEffect(() => {
api.get("/api/notification/getall").then((res) => setNotifications(res.data))
  
},[])
  console.log(notifications,'lololo');

  return (
          <div className="flex">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64 xl:mr-64 overflow-y-auto h-screen p-4 bg-gray-100">
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
         {notifications.map((notification) => (
          <li
            key={notification._id}
            className={`p-4 rounded-lg shadow ${
              notification.isRead ? "bg-gray-100" : "bg-white"
            }`
          
          }
          >
            <div className="flex items-center gap-4">
              {/* <img
                src={notification.sender.profilePicture}
                alt={notification.sender.name}
                className="w-10 h-10 rounded-full"
              /> */}
              <div>
                <p className="text-sm">{notification.type}</p>
                <p className="text-xs text-gray-500">
                  {/* {new Date(notification.createdAt).toLocaleString()} */}
                </p>
              </div>
            </div>
          </li>
        ))} 
      </ul>
    </div>
    </main>
    </div>
  );
};

export default Notifications;
