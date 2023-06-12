import { Link, useNavigate } from 'react-router-dom'
import '../styles/home.css'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext)

  function loginUser() {
    window.open('https://prettify-backend.onrender.com/auth/spotify', '_self')
  }

  console.log(isAuthenticated)
  const mainPageButton = isAuthenticated ?
    <Link className='home--login-btn' to="/main">VIEW YOUR DATA</Link> :
    <button className='home--login-btn' onClick={loginUser}>
      LOG IN WITH SPOFITY
    </button>


  return (
    <div className='home--container'>
      <h1>Prettify</h1>
      <h3>Turn your Spotify data into pretty graphs</h3>
      {mainPageButton}
    </div>
  )
}