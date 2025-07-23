import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import ChatPopUp from "./components/ChatPopUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DeletedPosts from "./pages/DeletedPosts";
import Notifications from "./pages/NotificationsPage";

function App() {
    
  const token = localStorage.getItem("token");
  console.log(token?.length);

  return (
    <>
     
      <BrowserRouter>
      {token &&  <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path='/friends' element={<Friends/>}/>
          <Route path="/profile/:id" element={<FriendProfile />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/deleted-posts" element={<DeletedPosts/>}/>
          <Route path="/notifications" element={<Notifications />} />

         

        </Routes>
      </BrowserRouter>
      <ChatPopUp/>
    </>
  );
}

export default App;
