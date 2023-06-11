export default function Track(props) {

  function openSpotifyTrack(link) {
    window.open(link)
  }

  const allArtists = props.artists.reduce((prev, curr) => prev + ', ' + curr)

  return (
    <div className="track--container">
      <img src={props.src} onClick={() => openSpotifyTrack(props.link)} />
      <h1>{props.name}</h1>
      <h4>{allArtists}</h4>
    </div>
  )
}