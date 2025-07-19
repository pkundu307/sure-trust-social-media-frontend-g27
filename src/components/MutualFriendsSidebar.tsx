import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Friend } from "../types/Friends";
import { Link } from "react-router-dom";

interface Props {
  userId: string;
}

const MutualFriendsSidebar = ({ userId }: Props) => {
  const [mutuals, setMutuals] = useState<Friend[]>([]);

  useEffect(() => {
    api
      .get(`/friendRequest/mutual`, { params: { targetId: userId } })
      .then((res) => {
        console.log("✅ Mutuals fetched:", res.data);
        setMutuals(res.data);
      })
      .catch((err) => {
        console.error("❌ Mutual fetch failed", err);
      });
  }, [userId]);

  if (mutuals.length === 0) return null;

  return (
    <aside className="hidden lg:block fixed right-1 bottom-65 w-69 z-50">
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-5 rounded-2xl shadow-2xl border border-gray-300 backdrop-blur">
        <h3 className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
          <span>👥</span> Mutual Friends
        </h3>
        <ul className="space-y-4">
          {mutuals.map((mf) => (
            <li
              key={mf._id}
              className="flex items-center justify-between p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={mf.avatar || "/images/user-placeholder.png"}
                  alt={mf.name}
                  className="w-10 h-10 rounded-full border border-purple-300 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{mf.name}</p>
                  <p className="text-xs text-gray-400">Mutual Friend</p>
                </div>
              </div>
              <Link
                to={`/profile/${mf._id}`}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default MutualFriendsSidebar;
