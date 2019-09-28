import { Row } from 'ActionView'

import React, { SFC } from 'react'

import './User.css'

import { Chip } from '../Chip'
import { Card } from '../Card'
import { ActionStatus } from '../ActionStatus'

export const User: SFC<{
  row: Row
  bigID: string
  round: number
  button: string
  position: 'left' | 'top' | 'right'
}> = ({ row, bigID, round, button: buttonID, position }) => {
  const button = buttonID === row.id && round !== 4 ? 'is-button' : ''
  const big = bigID === row.id ? 'is-big' : ''
  const className = `user-item ${position} ${big} ${button}`.trim()

  const cards = row.action.cards || [null, null]

  return (
    <div
      className={className}
      title={`Bet: ${row.action.bet} / Bank: ${row.sum}`}
    >
      <div className="player">
        <div className="bet-and-action">
          <div className="bet">
            <Chip /> <strong>{row.action.bet}</strong> / {row.sum}
          </div>
          <ActionStatus status={row.action.status} />
        </div>
        <div className="info">
          <h2 className="name">{row.name}</h2>
        </div>
        <div className="cards">
          {cards.map((card, i) => (
            <Card key={`player-${row.id}-${i}-${card}`} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default User
