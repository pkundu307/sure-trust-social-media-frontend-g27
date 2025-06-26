import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
