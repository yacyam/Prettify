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
import Track from "../components/Track"

export default function Main() {
  const [displayData, setDisplayData] = useState({
    genres: [],
    artistData: []
  })
  const [displayTracks, setDisplayTracks] = useState([])
  const [displayRecs, setDisplayRecs] = useState([])
  const [amountShow, setAmountShow] = useState(0)


  const { getSpotifyData, aggregateQualities, getRecs } = useContext(AuthContext)

  const updateShow = (count) => setAmountShow(prevShow => Math.max(prevShow, count))

  useEffect(() => {
    if (amountShow === 0) {
      updateSpotifyInfo()
    }
  }, [])

  function aggregateArtistData(artistInfo) {
    const dummyImage = "https://as1.ftcdn.net/v2/jpg/01/12/43/90/1000_F_112439016_DkgjEftsYWLvlYtyl7gVJo1H9ik7wu1z.jpg"

    const genreAmount = {}
    const artistDataHold = []

    //create huge map for all genres
    artistInfo.map((artist) => {
      artistDataHold.push({
        url: artist.images.length > 0 ? artist.images[0].url : dummyImage,
        name: artist.name,
        popularity: artist.popularity,
        id: artist.id
      })

      artist.genres.map((genre) => {
        genre in genreAmount ? genreAmount[genre] += 1 : genreAmount[genre] = 1
      })
    })

    const arrayTopGenres = Object.entries(genreAmount)
    arrayTopGenres.sort(([_, n1], [__, n2]) => n2 - n1)

    const finalTopGenres = arrayTopGenres.filter((_, i) => i < 6)
    const finalArtistData = artistDataHold.filter((_, index) => index < 9)

    const totalArtistData = {
      genres: finalTopGenres,
      artistData: finalArtistData
    }

    setDisplayData(() => totalArtistData)

    return totalArtistData
  }

  function aggregateTrackData(trackInfo) {
    const trackToArtists = trackInfo.map((tk) =>
      [tk.name, { artists: tk.artists.map((art) => art.name), id: tk.id }]
    ).filter((_, i) => i < 10)

    setDisplayTracks(() => trackToArtists)

    return trackToArtists
  }

  async function updateSpotifyInfo() {
    try {
      const [newArtistData, newTrackData] = await getSpotifyData()
      const artistData = aggregateArtistData(newArtistData)
      const trackData = aggregateTrackData(newTrackData)
      generateRecs(artistData, trackData)
    } catch (err) {
      if (err.response.status === 401) {
        console.log('need new access token')
        await axios.get('https://prettify-backend.onrender.com/user/refresh_token', { withCredentials: true })
        const [newArtistData, newTrackData] = await getSpotifyData()
        const artistData = aggregateArtistData(newArtistData)
        const trackData = aggregateTrackData(newTrackData)
        generateRecs(artistData, trackData)
      }
      else {
        console.log('Something went wrong')
      }
    }
  }

  async function generateRecs(artists, tracks) {
    const avgFeatures = await aggregateQualities(tracks)
    const spotifyRecs = await getRecs(artists, tracks, avgFeatures)

    const finalRecs = spotifyRecs.filter((_, i) => i < 5)

    setDisplayRecs(finalRecs)
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
          color: 'black',
          font: {
            size: 17
          }
        },
        beginAtZero: true,
      },

      x: {
        ticks: {
          color: 'black',
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
    color: 'black'
  }

  const trackElements = displayTracks.map(([track, trackData], i) => {
    const artistStr = trackData.artists.reduce((prev, curr) => prev + ", " + curr)

    const artistToTrack = artistStr + " - " + track

    if (displayData.artistData.every((art) => !trackData.artists.includes(art.name))) {
      return <li
        key={i}
      >{artistToTrack}</li>
    }
    else {
      return <li
        key={i}
        className="main--highlight"
      >{artistToTrack}</li>
    }
  })

  const recommendElements =
    displayRecs.map((track, i) =>
      <Track
        key={i}
        src={track.image}
        link={track.url}
        name={track.name}
        artists={track.artists}
      />
    )

  function dataComponent(Component, buttonText, whenShow) {
    const needAbove = whenShow - 1

    return (
      <div className="main--data">
        {
          amountShow == needAbove && <button onClick={() => updateShow(whenShow)}>
            {buttonText}
          </button>
        }
        {
          Component
        }
      </div>
    )
  }

  const whenVisible = (above) => amountShow >= above ? ` visible` : ` invisible`

  return (
    <div className="main--container">
      <div className="main--top-data">
        {
          dataComponent(
            <section className={"main--all-images" + (whenVisible(1))}>
              {imgElems}
            </section>,
            "SEE YOUR ARTIST 3X3", 1
          )
        }

        {
          dataComponent(
            <section className={"main--all-tracks" + (whenVisible(2))}>
              <ol>
                {trackElements}
              </ol>
            </section>,
            "SEE YOUR TOP 10 TRACKS", 2
          )
        }

      </div>


      {dataComponent(
        <Pie
          data={pieChartData}
          options={pieChartOptions}
          className={"main--pie" + (whenVisible(3))}
        >
        </Pie>, "SEE YOUR FAVORITE GENRES", 3)}

      {
        dataComponent(
          <Bar
            data={barChartData}
            options={barChartOptions}
            className={"main--bar" + (whenVisible(4))}
          ></Bar>, "SEE YOUR LISTENING POPULARITY", 4
        )
      }

      <>
        {
          amountShow == 4 && <button onClick={() => updateShow(5)}>
            SEE YOUR SONG RECOMMENDATIONS
          </button>
        }
        {
          <div className={"main--track-container" + (whenVisible(5))}>
            {recommendElements}
          </div>
        }
      </>
    </div>
  )
}

