import React, { SFC } from 'react'

import { toHex, isRed } from '../../utils/card'

import './Card.css'

export const Card: SFC<{
  card: string
}> = ({ card }) => (
  <svg viewBox="0 0 62.873809 87.825096" className="card" key={card}>
    <use xlinkHref="/cards.svg#card" x="0" y="0" />
    <use
      xlinkHref={`/cards.svg#${toHex(card)}`}
      className={isRed(card) ? 'text-red-600' : 'text-gray-800'}
      x="0"
      y="0"
      style={{ stroke: 'transparent' }}
    />
  </svg>
)

export default Card
