import axios from "axios"
import { useEffect, useState } from "react"

export default function Main() {
  const [userInfo, setUserInfo] = useState([])
  const [displayData, setDisplayData] = useState({
    name: "",
    src: ""
  })

  async function getSpotifyInfo() {
    const accessToken = await axios.get('http://localhost:3000/user/info',
      { withCredentials: true })

    const spotifyData = await axios.get('https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          Authorization: `Bearer ${accessToken.data}`
        }
      })
    setUserInfo(spotifyData.data.items)
    console.log(userInfo)
  }

  function showData() {
    const dataIndex = Math.floor(Math.random() * (userInfo.length))

    const dataImage = userInfo[dataIndex].images[0].url
    const dataName = userInfo[dataIndex].name

    setDisplayData({ name: dataName, src: dataImage })
  }

  return (
    <div className="main--container">
      <button onClick={getSpotifyInfo}>Get user info</button>
      <button onClick={showData}> Show Data </button>
      <h1>{displayData.name}</h1>
      <img src={displayData.src} alt="image of random band" />
    </div>
  )
}