import axios from "axios"
import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"


export default function Main() {
  const [userInfo, setUserInfo] = useState([])
  const [displayData, setDisplayData] = useState({
    name: "",
    src: ""
  })

  const { getSpotifyData } = useContext(AuthContext)

  async function updateSpotifyInfo() {
    try {
      const newSpotifyData = await getSpotifyData()
      setUserInfo(newSpotifyData)

    } catch (err) {
      if (err.response.status === 401) {
        console.log('need new access token')
        await axios.get('http://localhost:3000/user/refresh_token', { withCredentials: true })
        const newSpotifyData = await getSpotifyData()
        setUserInfo(newSpotifyData)
      }
      else {
        console.log('Something went wrong')
      }
    }
  }

  function showData() {
    const dataIndex = Math.floor(Math.random() * (userInfo.length))

    const dataImage = userInfo[dataIndex].images[0].url
    const dataName = userInfo[dataIndex].name

    setDisplayData({ name: dataName, src: dataImage })
  }

  return (
    <div className="main--container">
      <button onClick={updateSpotifyInfo}>Get user info</button>
      <button onClick={showData}> Show Data </button>
      <h1>{displayData.name}</h1>
      <img src={displayData.src} alt="image of random band" />
    </div>
  )
}

