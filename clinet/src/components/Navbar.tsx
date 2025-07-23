import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { FiHome, FiBell, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ✅ Use this profileImage state to control the avatar shown
  const [profileImage, setProfileImage] = useState<string>("https://i.pravatar.cc/300");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("profileImage");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-3">
            <Link to="/home" className="text-indigo-600 font-bold text-xl">
              Buddies
            </Link>
            <div className="hidden sm:block">
              <div className="bg-gray-100 flex items-center px-3 py-1 rounded-full w-60">
                <Search />
              </div>
            </div>
          </div>

          {/* Center: Navigation Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-600 hover:text-indigo-600">
              <FiHome size={22} />
            </Link>
            <Link to="/notifications" className="text-gray-600 hover:text-indigo-600">
              <FiBell size={22} />
            </Link>
            <Link to="/friends" className="text-gray-600 hover:text-indigo-600">
              <FiUser size={22} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none"
              >
                <img
                  src={profileImage || "https://via.placeholder.com/40"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-md z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-4 bg-white border-t space-y-3.5">
          <Search />
          <Link to="/home" className="block text-gray-600 hover:text-indigo-400 ml-2">
            <FiHome size={22} />
          </Link>
          <Link to="/Profile" className="block text-gray-600 hover:text-indigo-400 ml-2">
            <FiUser size={22} />
          </Link>
          <Link to="/Notification" className="block text-gray-600 hover:text-indigo-400 ml-2">
            <FiBell size={22} />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
