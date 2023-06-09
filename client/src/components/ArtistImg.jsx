import { useState } from "react"

/* eslint react/prop-types: 0 */
export default function ArtistImg(props) {

  return (
    <div className="artist--container">
      <img
        src={props.src}
        width={220}
        height={220}
      />
      <p className="img-name">{props.name}</p>
    </div>
  )
}