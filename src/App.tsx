
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Profile from './pages/Profile'
import Home from './pages/Home'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
               <Login/>
        }/>
      <Route
        path="/profile"
        element={
          <Profile/>
        }/>
      <Route path='/home'
      element={
        <Home/>
      }
      />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
