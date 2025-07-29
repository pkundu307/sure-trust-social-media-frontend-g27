import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

interface Profile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setQuery("");
    setFriends([]);
    setSearched(false);
    setLoading(false);
  }, [location.pathname]);

  const handleFriendSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setFriends([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/friends/search-friends?name=${trimmedQuery}`);
      setFriends(res.data || []);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setFriends([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setLoading(false);
    setFriends([]);
    setSearched(false);
  };

  useEffect(() => {
    if (query.trim() === "") {
      setFriends([]);
      setSearched(false);
    }
  }, [query]);

  return (
    <div className="relative w-full">
      {/* Search Input Bar */}
      <div className="bg-gray-100 rounded-full h-10 w-full px-3 flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            className="bg-transparent outline-none w-full text-sm placeholder-gray-500"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFriendSearch()}
          />
        </div>

        <div className="w-5 flex justify-center items-center">
          {query && (
            <button
              onClick={handleClearSearch}
              className="text-gray-500 hover:text-red-500"
              title="Clear"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="w-5 flex justify-center items-center">
          <button
            onClick={handleFriendSearch}
            className="text-gray-600 hover:text-indigo-600"
            title="Search"
          >
            <FiSearch size={16} />
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500 mt-2 text-sm">Searching...</p>}

      {/* Results */}
      {!loading && searched && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="border-b px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <h3 className="font-medium text-base text-gray-800">{friend.name}</h3>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                  <Link
                    to={`/profile/${friend.email}`}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    ➡
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
