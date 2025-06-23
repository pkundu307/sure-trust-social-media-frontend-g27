import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <Link to="/home" className="text-xl font-bold ">
          SocialApp
        </Link>
        <div className="space-x-4">
          <Link to="/Profile" className="text-xl font-bold ">
            <img
            className="h-10 rounded-4xl"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s" />
          </Link>
          <button>Logout</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
