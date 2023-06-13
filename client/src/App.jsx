import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Main from './pages/Main'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'
import Login from './pages/Login'
import Navbar from './pages/Navbar'
import Loading from './pages/Loading'
import './styles/app.css'

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext)

  return (
    <div className='app--container'>
      {
        isLoading ? <Loading /> : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/main" element={isAuthenticated ? <Main /> : <Login />} />
            </Routes>
          </>
        )
      }
    </div>
  )
}

export default App
