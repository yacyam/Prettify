/* eslint react/prop-types: 0 */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext()

export default AuthContext

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/user/authenticate', { withCredentials: true })
      .then(res => {
        if (res.data === 'ok') {
          setIsAuthenticated(true)
        }
        else {
          setIsAuthenticated(false)
        }
      })
      .catch(err => console.log('Error in obtaining authentication info'))
  }, [])

  async function getSpotifyData() {
    console.log('here 1')
    const accessToken = await axios.get('http://localhost:3000/user/info',
      { withCredentials: true })

    console.log('here 2')
    const spotifyData = await axios.get('https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          Authorization: `Bearer ${accessToken.data}`
        },
      })

    console.log('here 3')
    return spotifyData.data.items
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getSpotifyData }}>
      {children}
    </AuthContext.Provider>
  )
}