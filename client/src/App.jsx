import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Main from './pages/Main'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
