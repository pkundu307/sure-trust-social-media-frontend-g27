import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { FiHome, FiBell, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");
    setIsProfileOpen(false)
    navigate("/");
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
              <img src={localStorage.getItem("PP")||""}/>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none"
              >
                <img
                  src="https://i.pravatar.cc/300"
                  className="w-9 h-9 rounded-full border border-gray-300 object-cover hover:ring-2 hover:ring-indigo-400 transition"
                  alt="avatar"
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
{isMobileMenuOpen && (<>
<div className="md:hidden px-4 pb-4 pt-4 bg-white border-t space-y-3.5">
  <Search/>
  <Link to="/home" className="block text-gray-600 hover:text-indigo-400 ml-2"><FiHome size={22}/></Link>
    <Link to="/Profile" className="block text-gray-600 hover:text-indigo-400 ml-2"><FiUser size={22}/></Link>
  <Link to="/Notification" className="block text-gray-600 hover:text-indigo-400 ml-2"><FiBell size={22}/></Link>

</div>
</>)}
    
    </nav>
  );
};

export default Navbar;
