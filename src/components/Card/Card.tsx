import React, { SFC } from 'react'

import { toHex, isRed } from '../../utils/card'

import './Card.css'

export const Card: SFC<{
  card: string
  className?: string
}> = ({ card, className: cn }) => (
  <div className={`card ${cn || ''}`} key={card}>
    <svg viewBox="0 0 62.8738 87.8251">
      <use xlinkHref="/cards.svg#card" x="0" y="0" />
      <use
        xlinkHref={`/cards.svg#${toHex(card)}`}
        className={`face ${isRed(card) ? 'text-red-600' : 'text-gray-800'}`}
        x="0"
        y="0"
        style={{ stroke: 'transparent' }}
      />
    </svg>
    <div className="back" />
  </div>
)

export default Card
