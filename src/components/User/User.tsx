import { Row } from 'ActionView'
import { Action } from 'CAction'

import React, { SFC } from 'react'

import './User.css'

import { IconThumbUp } from 'react-heroicons-ui'

import { Chip } from '@/components/Chip'
import { Card } from '@/components/Card'
import { ActionStatus } from '@/components/ActionStatus'
import getHand from '@/utils/hand'

export const User: SFC<{
  bigID: Action['big']
  button: Action['button']
  position?: 'left' | 'top' | 'right'
  round: Action['round']
  row: Row
  sidePot?: Action['sidePot'][0]
  winner: boolean
}> = ({
  bigID,
  button: buttonID,
  position = '',
  round,
  row,
  sidePot,
  winner,
}) => {
  const button = buttonID === row.id && round !== 4 ? 'is-button' : ''
  const big = bigID === row.id && round !== 4 ? 'is-big' : ''
  const hideCards =
    round === 0 || row.action.status === 'fold' ? 'hide-cards' : ''

  const className = `c_user-item ${position} ${big} ${button} ${hideCards}`.trim()
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
            {(sidePot && (
              <span className="chips">
                <Chip className="chip" type="thin" />
                <Chip className="chip" type="thin" />
                <Chip className="chip" type="thin" />
              </span>
            )) ||
              (row.action.bet > 0 && (
                <Chip className="single-chip" type="thin" />
              ))}
            <strong>{row.action.bet}</strong> / {row.sum}
          </div>
          <ActionStatus status={row.action.status} winner={winner} />
        </div>
        <div className="info">
          {round === 4 && row.action.status === 'confirm' && (
            <IconThumbUp className="thumbs-up" />
          )}
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
