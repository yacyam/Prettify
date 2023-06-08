import axios from "axios"
import { useContext, useState } from "react"
import AuthContext from "../context/AuthContext"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)



export default function Main() {
  const [userInfo, setUserInfo] = useState([])
  const [displayData, setDisplayData] = useState([])
  const [showAll, setShowAll] = useState(false)

  const { getSpotifyData } = useContext(AuthContext)

  function aggregateData() {
    setDisplayData(() => {
      const dataHold = {}

      //create huge map for all genres
      userInfo.map((artist) => {
        artist.genres.map((genre) => {
          genre in dataHold ? dataHold[genre] += 1 : dataHold[genre] = 1
        })
      })

      const arrayTopData = Object.entries(dataHold)
      arrayTopData.sort(([_, n1], [__, n2]) => n2 - n1)

      const finalTopData = arrayTopData.filter((_, i) => i < 6)

      console.log(finalTopData)
      return finalTopData
    })

    setShowAll(true)
  }

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

  const data = {
    labels: displayData.map(([genre, _]) => genre),
    datasets: [
      {
        data: displayData.map(([_, amount]) => amount),
        backgroundColor: [
          'rgb(0, 63, 92)',
          'rgb(88, 80, 141)',
          'rgb(188, 80, 144)',
          'rgb(255, 99, 97)',
          'rgb(255, 166, 0)',
          'yellow'
        ]
      }
    ]
  }

  const options = {
    color: 'white'
  }

  return (
    <div className="main--container">
      <button onClick={updateSpotifyInfo}>Get user info</button>
      <button onClick={aggregateData}> Show Data </button>
      {showAll && <div style={{
        padding: '20px',
        width: '50%',
        color: 'white'
      }}>
        <Pie
          data={data}
          options={options}
        >
        </Pie>
      </div>}
    </div>
  )
}

