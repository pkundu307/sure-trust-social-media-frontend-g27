import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Friend } from "../types/Friends";
import { Link } from "react-router-dom";

interface Props {
  userId: string;
}

const RightSidebar = ({ userId }: Props) => {
  const [mutuals, setMutuals] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleError = (error: any) => {
    console.error("Error fetching mutual friends:", error);
    setLoading(false);
  };

  const fetchMutualFriends = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/friendRequest/mutual", {
        params: { targetId: userId },
      });
      setMutuals(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMutualFriends();
  }, []);

  const displayedFriends = showAll ? mutuals : mutuals.slice(0, 5);

  return (
    <aside className="hidden xl:flex flex-col w-64 h-screen bg-white shadow-md border-l border-gray-200 fixed right-0 top-12 p-4 p-5 rounded-2xl shadow-2xl border border-gray-300">
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
          Suggestions
        </h3>

        {loading ? (
          <div className="text-center text-gray-400 font-medium">Loading...</div>
        ) : mutuals.length > 0 ? (
          <>
            <ul className="space-y-3 text-sm text-gray-700">
              {displayedFriends.map((mf) => (
                <li
                  key={mf._id}
                  className="flex items-center justify-between p-2 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={"/images/user-placeholder.png"}
                      alt={mf.name}
                      className="w-10 h-10 rounded-full border border-purple-300 object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{mf.name}</p>
                    </div>
                  </div>

                  <Link
                    to={`/profile/${mf._id}`}
                    className="text-sm text-gray-200 font-semibold hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>

            {/* View More / View Less Button */}
            {mutuals.length > 5 && (
              <button
                className="mt-4 mx-auto block px-4 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-full transition duration-200 shadow-sm"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "View Less" : "View More"}
              </button>
            )}
          </>
        ) : (
          <div className="text-center mt-8 text-gray-500 font-semibold">
            Add new friends to get suggestions
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
