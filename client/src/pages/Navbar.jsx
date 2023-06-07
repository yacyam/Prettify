import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import '../styles/navbar.css'
import axios from "axios"

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext)

  async function logoutUser() {
    window.open('http://localhost:3000/auth/logout', '_self')
  }

  return (
    <nav className="navbar--container">
      {isAuthenticated &&
        <button
          className="navbar--logout-btn" onClick={logoutUser}> LOGOUT
        </button>}
    </nav>
  )
}