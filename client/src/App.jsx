import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Main from './pages/Main'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'

function App() {
  const { isAuthenticated } = useContext(AuthContext)
  console.log(isAuthenticated)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={isAuthenticated ? <Main /> : <Home />} />
    </Routes>
  )
}

export default App
