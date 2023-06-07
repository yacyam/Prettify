import { useContext } from 'react'
import '../styles/login.css'
import AuthContext from '../context/AuthContext'

export default function Login() {
  const { isAuthenticated } = useContext(AuthContext)

  setTimeout(() => {
    if (!isAuthenticated) {
      console.log('here')
      history.pushState({}, '', '/')
      location.reload()
    }
  }, 2000)

  return (
    <div className='block--container'>
      <h1>Please login to view this page</h1>
    </div>
  )
}