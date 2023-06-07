import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Main from './pages/Main'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import './styles/app.css'

function App() {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className='app--container'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={isAuthenticated ? <Main /> : <Login />} />
      </Routes>
    </div>
  )
}

export default App
