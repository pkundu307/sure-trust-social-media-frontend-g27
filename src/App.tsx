
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Welcome to the Home Page</h1>
          </div>
        }/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
