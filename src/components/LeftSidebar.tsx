import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUserFriends,
  FaInfoCircle,
} from "react-icons/fa";

const Sidebar = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
  const baseClasses =
    "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-blue-50 hover:text-blue-700";
  const activeClasses = "bg-blue-100 text-blue-900 font-semibold";

  return `${baseClasses} ${hoverClasses} ${
    isActive ? activeClasses : "text-gray-700"
  }`;
};

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white shadow-md border-r border-gray-200 fixed left-0 top-0 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Menu</h2>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <NavLink to="/home" className={getNavLinkClass}>
              <FaHome size={18} />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={getNavLinkClass}>
              <FaUser size={18} />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/friends" className={getNavLinkClass}>
              <FaUserFriends size={18} />
              Friends
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={getNavLinkClass}>
              <FaInfoCircle size={18} />
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
