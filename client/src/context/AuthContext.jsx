/* eslint react/prop-types: 0 */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext()

export default AuthContext

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/getuser', { withCredentials: true })
      .then(res => {
        if (res.data === 'ok') {
          setIsAuthenticated(true)
        }
        else {
          setIsAuthenticated(false)
        }
      })
      .catch(err => console.log('oops'))
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}