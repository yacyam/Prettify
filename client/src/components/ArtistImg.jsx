import { useState } from "react"

/* eslint react/prop-types: 0 */
export default function ArtistImg(props) {
  const [style, setStyle] = useState({})
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="artist--container">
      <img
        src={props.src}
        width={220}
        height={220}
        style={style}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      <p className="img-name">{props.name}</p>
    </div>
  )
}