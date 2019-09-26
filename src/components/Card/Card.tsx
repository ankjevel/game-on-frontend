import React, { SFC } from 'react'

import { html, isRed } from '../../utils/card'

import './Card.css'

export const Card: SFC<{
  card: string
}> = props => (
  <svg version="1.1" x="0px" y="0px" viewBox="0 0 75 100" className="card">
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="white"
      fill-rule="evenodd"
      mask={`url(#${props.card})`}
    />

    <mask id={props.card} maskUnits="userSpaceOnUse">
      <rect x="12%" y="12%" width="76%" height="76%" fill="white" />
      <text
        x="50%"
        y="62.5%"
        dominant-baseline="middle"
        text-anchor="middle"
        lengthAdjust="spacing"
        font-size="105"
        preserve-aspect-ratio="xMidYMid meet"
        // className={isRed(props.card) ? 'text-red-600' : 'text-gray-800'}
        className="text-black"
        dangerouslySetInnerHTML={html(props.card)}
      />
    </mask>
  </svg>
)

export default Card
