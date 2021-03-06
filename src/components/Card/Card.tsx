import React, { SFC } from 'react'

import './Card.css'

import { toHex, isRed } from '@/utils/card'

export const Card: SFC<{
  card: MaybeNull<string>
  className?: string
}> = ({ card, className: cn = '' }) => {
  const className = `c_card ${card == null ? 'none' : ''} ${cn}`.trim()
  const backClassName = `back ${card == null ? 'rotate' : ''}`.trim()
  return (
    <div className={className}>
      {card != null && (
        <svg viewBox="0 0 62.8738 87.8251">
          <use xlinkHref="/cards.svg#card" x="0" y="0" />

          <use
            xlinkHref={`/cards.svg#${toHex(card)}`}
            className={`face ${isRed(card) ? 'is-red' : ''}`}
            x="0"
            y="0"
            style={{ stroke: 'transparent' }}
          />
        </svg>
      )}
      <div className={backClassName} />
    </div>
  )
}

export default Card
