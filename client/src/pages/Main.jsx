import axios from "axios"
import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
)

import '../styles/main.css'
import ArtistImg from "../components/ArtistImg"

export default function Main() {
  const [displayData, setDisplayData] = useState({
    genres: [],
    artistData: []
  })
  const [amountShow, setAmountShow] = useState(0)


  const { getSpotifyData } = useContext(AuthContext)

  const updateShow = (count) => setAmountShow(prevShow => Math.max(prevShow, count))

  useEffect(() => {
    if (amountShow === 0) {
      updateSpotifyInfo()
    }
  }, [])

  function aggregateData(userInfo) {
    console.log(userInfo)
    const dummyImage = "https://as1.ftcdn.net/v2/jpg/01/12/43/90/1000_F_112439016_DkgjEftsYWLvlYtyl7gVJo1H9ik7wu1z.jpg"

    setDisplayData(() => {
      const genreAmount = {}
      const artistDataHold = []

      //create huge map for all genres
      userInfo.map((artist) => {
        if (artist.images.length > 0) {
          artistDataHold.push({
            url: artist.images[0].url,
            name: artist.name,
            popularity: artist.popularity,
          })
        }
        else {
          artistDataHold.push({
            url: dummyImage,
            name: artist.name,
            popularity: artist.popularity
          })
        }

        artist.genres.map((genre) => {
          genre in genreAmount ? genreAmount[genre] += 1 : genreAmount[genre] = 1
        })
      })

      const arrayTopGenres = Object.entries(genreAmount)
      arrayTopGenres.sort(([_, n1], [__, n2]) => n2 - n1)

      const finalTopGenres = arrayTopGenres.filter((_, i) => i < 6)
      const finalArtistData = artistDataHold.filter((_, index) => index < 9)

      return {
        genres: finalTopGenres,
        artistData: finalArtistData
      }
    })
  }

  async function updateSpotifyInfo() {
    try {
      const newSpotifyData = await getSpotifyData()
      aggregateData(newSpotifyData)
    } catch (err) {
      if (err.response.status === 401) {
        console.log('need new access token')
        await axios.get('http://localhost:3000/user/refresh_token', { withCredentials: true })
        const newSpotifyData = await getSpotifyData()
        aggregateData(newSpotifyData)
      }
      else {
        console.log('Something went wrong')
      }
    }
  }


  const imgElems =
    displayData.artistData.map((data, i) =>
      <ArtistImg
        key={i}
        src={data.url}
        name={data.name} />
    )

  const pieChartData = {
    labels: displayData.genres.map(([genre, _]) => genre),
    datasets: [
      {
        data: displayData.genres.map(([_, amount]) => amount),
        backgroundColor: [
          'rgb(0, 63, 92)',
          'rgb(88, 80, 141)',
          'rgb(188, 80, 144)',
          'rgb(255, 99, 97)',
          'rgb(255, 166, 0)',
          'green'
        ]
      }
    ]
  }

  const pieChartOptions = {
    tooltips: {
      enabled: false
    },
    color: 'black',
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20
          }
        }
      },
      datalabels: {
        color: 'white',
        formatter: function (value, context) {
          return Math.round(value / context.chart.getDatasetMeta(0).total * 100) + "%";
        }
      }
    }
  }


  const sortedPopularityArtists =
    [...displayData.artistData].sort((a, b) => b.popularity - a.popularity)

  const barChartData = {
    labels: sortedPopularityArtists.map((data) => data.name),
    datasets: [{
      label: 'Artist Popularity',
      data: sortedPopularityArtists.map((data) => data.popularity),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 192, 203, 0.8)',
        'rgba(198, 226, 255, 0.8)',
        'rgba(221, 221, 221, 0.8)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(54, 162, 235)',
        'rgb(255, 192, 203)',
        'rgb(198, 226, 255)',
        'rgb(221, 221, 221)'
      ],
      borderWidth: 1,
      color: 'white'
    }]
  }

  const barChartOptions = {
    scales: {
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 17
          }
        },
        beginAtZero: true,
      },

      x: {
        ticks: {
          color: 'white',
          font: {
            size: 20
          }
        },
      }
    },

    plugins: {
      legend: {
        labels: {
          font: {
            size: 20
          }
        }
      }
    },
    color: 'white'
  }



  function dataComponent(Component, buttonText, whenShow) {
    const needAbove = whenShow - 1

    return (
      <div className="main--data">
        {
          amountShow == needAbove && <button onClick={() => updateShow(whenShow)}>
            {buttonText}
          </button>
        }
        {Component}
      </div>
    )
  }

  return (
    <div className="main--container">
      {
        dataComponent(
          <section
            className={"main--all-images "
              + (amountShow > 0 ? `visible` : `invisible`)}
          >
            {imgElems}
          </section>,
          "SEE YOUR ARTIST 3X3", 1
        )
      }

      {dataComponent(
        <Pie
          data={pieChartData}
          options={pieChartOptions}
          className={`main--pie ` + (amountShow > 1 ? `visible` : `invisible`)}
        >
        </Pie>, "SEE YOUR FAVORITE GENRES", 2)}

      {
        dataComponent(
          <Bar
            data={barChartData}
            options={barChartOptions}
            className={"main--bar " + (amountShow > 2 ? `visible` : `invisible`)}
          ></Bar>, "SEE YOUR LISTENING POPULARITY", 3
        )
      }
    </div>
  )
}

