import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import ChatPopUp from "./components/ChatPopUp";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <BrowserRouter>
        {token && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile/:id" element={<FriendProfile />} />
        </Routes>
      </BrowserRouter>

      {/* Always shown on screen */}
      <ChatPopUp />

      {/* ✅ This line is step 2: REQUIRED to display toast messages */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </>
  );
}

export default App;
