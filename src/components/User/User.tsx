import { Row } from 'ActionView'

import React, { SFC } from 'react'

import './User.css'

import { Chip } from '../Chip'
import { Card } from '../Card'
import { ActionStatus } from '../ActionStatus'
import { IconThumbUp } from 'react-heroicons-ui'

import getHand from '../../utils/hand'
import { Action } from 'CAction'

export const User: SFC<{
  row: Row
  bigID: Action['big']
  round: Action['round']
  button: Action['button']
  position: 'left' | 'top' | 'right'
  winner: boolean
}> = ({ row, bigID, round, button: buttonID, position, winner }) => {
  const button = buttonID === row.id && round !== 4 ? 'is-button' : ''
  const big = bigID === row.id && round !== 4 ? 'is-big' : ''
  const className = `c_user-item ${position} ${big} ${button}`.trim()

  const cards = row.action.cards || [null, null]
  const hand = getHand(row.action.hand)

  return (
    <div
      className={className}
      title={`${row.name}\n${hand ? `${hand}\n` : ''}Bet: ${
        row.action.bet
      } / Bank: ${row.sum}`}
    >
      <div className="player">
        <div className="bet-and-action">
          <div className="bet">
            <Chip /> <strong>{row.action.bet}</strong> / {row.sum}
          </div>
          <ActionStatus status={row.action.status} winner={winner} />
        </div>
        <div className="info">
          {round === 4 && <IconThumbUp className="thumbs-up" />}
          <h2 className="name">{row.name}</h2>
        </div>
        <div className="cards">
          {cards.map((card, i) => (
            <Card
              className="card"
              key={`player-${row.id}-${i}-${card}`}
              card={card}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default User
