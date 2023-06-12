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
    const accessToken = await axios.get('http://localhost:3000/user/info',
      { withCredentials: true })

    const artistData = await axios.get('https://api.spotify.com/v1/me/top/artists',
      {
        headers: {
          Authorization: `Bearer ${accessToken.data}`
        },
      })

    const trackData = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${accessToken.data}`
      },
    })

    return [artistData.data.items, trackData.data.items]
  }

  async function aggregateQualities(tracks) {
    const accessToken = await axios.get('http://localhost:3000/user/info',
      { withCredentials: true })

    const allTrackStr =
      tracks.map(([_, track]) => track.id).reduce((prev, curr) => prev + "%2C" + curr)

    const trackData =
      await axios.get(`https://api.spotify.com/v1/audio-features?ids=${allTrackStr}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.data}`
          },
        })

    const avgFeatures = trackData.data.audio_features.reduce((prev, curr) => {
      return {
        danceability: (prev.danceability + curr.danceability),
        duration_ms: (prev.duration_ms + curr.duration_ms),
        energy: (prev.energy + curr.energy),
        instrumentalness: (prev.instrumentalness + curr.instrumentalness),
        key: (prev.key + curr.key),
        liveness: (prev.liveness + curr.liveness),
        loudness: (prev.key + curr.key),
        mode: (prev.mode + curr.mode),
        speechiness: (prev.speechiness + curr.speechiness),
        tempo: (prev.tempo + curr.tempo),
        valence: (prev.valence + curr.valence)
      }
    })

    const numTracks = tracks.length

    for (let key in avgFeatures) {
      if (key === 'duration_ms' || key === 'key') {
        avgFeatures[key] = Math.floor(avgFeatures[key] / numTracks)
      }
      else if (key === 'mode') {
        const avgMode = avgFeatures[key] * 1.0 / numTracks
        if (avgMode <= 0.23) {
          avgFeatures[key] = 0
        }
        else if (avgMode > 0.77) {
          avgFeatures[key] = 1
        }
        else {
          /* Don't want to set explicit mode target since its in middle range */
          avgFeatures[key] = -1
        }
      }
      else {
        avgFeatures[key] = parseFloat((avgFeatures[key] / numTracks).toPrecision(4))
      }
    }

    return avgFeatures
  }

  async function getRecs(artists, tracks, qualities) {
    const accessToken = await axios.get('http://localhost:3000/user/info',
      { withCredentials: true })

    let firstGenre = artists.genres[0][0]
    let secondGenre = ""
    artists.genres.map((genre, i) => {
      if (genre[0].length > secondGenre.length && i !== 0) {
        secondGenre = genre[0]
      }
    })

    const allGenres = firstGenre + `%2C` + secondGenre

    let artistInd1 = Math.floor(Math.random() * artists.artistData.length)
    let artistInd2 = Math.floor(Math.random() * artists.artistData.length)
    while (artistInd2 === artistInd1) {
      artistInd2 = Math.floor(Math.random() * artists.artistData.length)
    }

    const actualArtist1 = artists.artistData[artistInd1].id
    const actualArtist2 = artists.artistData[artistInd2].id

    const allArtists = actualArtist1 + `%2C` + actualArtist2

    const trackChosen = tracks[Math.floor(Math.random() * tracks.length)][1].id

    const finalURL =
      `https://api.spotify.com/v1/recommendations?seed_artists=${allArtists}` +
      `&seed_genres=${allGenres}&seed_tracks=${trackChosen}&` +
      `target_danceability=${qualities.danceability}&` +
      `target_duration_ms=${qualities.duration_ms}&` +
      `target_energy=${qualities.energy}&` +
      `target_instrumentalness=${qualities.instrumentalness}&` +
      `target_key=${qualities.key}&` +
      `target_liveness=${qualities.liveness}&` +
      `target_loudness=${qualities.loudness}&` +
      `${qualities.mode === -1 ? "" : `target_mode=${qualities.mode}&`}` +
      `target_speechiness=${qualities.speechiness}&` +
      `target_tempo=${qualities.tempo}&` +
      `target_valence=${qualities.valence}`

    const newURL = finalURL.replace(/\s/g, '+')

    const recommendTracks = await axios.get(newURL, {
      headers: {
        Authorization: `Bearer ${accessToken.data}`
      },
    })

    const finalTrackData = recommendTracks.data.tracks.map((track) => {
      return {
        name: track.name,
        artists: track.artists.map((art) => art.name),
        url: track.external_urls.spotify,
        image: track.album.images[0].url
      }
    })

    return finalTrackData
  }



  return (
    <AuthContext.Provider value={{ isAuthenticated, getSpotifyData, aggregateQualities, getRecs }}>
      {children}
    </AuthContext.Provider>
  )
}