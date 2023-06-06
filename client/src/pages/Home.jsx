import '../styles/home.css'

export default function Home() {
  function loginUser() {
    window.open('http://localhost:3000/auth/spotify', '_self')
  }

  return (
    <div className='home--container'>
      <h1>Prettify</h1>
      <h3>Turn your Spotify data into pretty graphs</h3>
      <button
        className='home--login-btn'
        onClick={loginUser}
      >
        LOG IN WITH SPOFITY
      </button>
    </div>
  )
}