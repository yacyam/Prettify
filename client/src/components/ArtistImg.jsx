import { useState } from "react"

/* eslint react/prop-types: 0 */
export default function ArtistImg(props) {

  return (
    <div className="artist--container">
      <img
        src={props.src}
        className="artist--img"
      />
      <p className="img-name">{props.name}</p>
    </div>
  )
}