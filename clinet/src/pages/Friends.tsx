import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Friend, FriendRequest } from "../types/Friends";

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchData = () => {
    api
      .get("/friendRequest/all")
      .then((res) => setFriendRequests(res.data))
      .catch(() => alert("Failed to load friend requests"));

    api
      .get("friendRequest/allfriends")
      .then((res) => setFriends(res.data))
      .catch(() => alert("Failed to load friends"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("====================================");
  console.log("friends", friends[0]);
  console.log("====================================");
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 ">Friend Requests</h2>
      {friendRequests.length === 0 ? (
        <>
          <p>No Pending Requests</p>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <>
                <div
                  key={request._id}
                  className="bg-white p-4 shadow rounded-3xl flex justify-between"
                >
                  <span>{request.from.name}</span>
                  <button className="bg-green-500 text-amber-100 font-bold rounded-4xl p-2">
                    Accept
                  </button>
                  <button className="bg-red-500 text-amber-100 font-bold rounded-4xl p-2">
                    Decline
                  </button>
                </div>
              </>
            ))}
          </div>
        </>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Friends</h2>
      {friends.length === 0 ? (
        <p>No Friends</p>
      ) : (
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white p-4 shadow rounded-3xl flex justify-between"
            >
              <span>{friend.name}</span>
              <button className="bg-red-500 text-amber-100 font-bold rounded-4xl p-2">
                Unfriend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
