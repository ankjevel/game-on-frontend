import React, { SFC, Fragment } from 'react'

import './PlayerHand.css'

import getText, { Hand } from '../../utils/hand'

export const PlayerHand: SFC<{
  className?: string
  hand: Hand
  winner?: boolean
}> = ({ className: cn, hand, winner }) => {
  const text = getText(hand) || ''
  const className = `c_player-hand ${cn}`.trim()
  const classNameWinner = `c_player-hand-winner ${cn}`.trim()

  return (
    <Fragment>
      <h3 className={className}>
        {text && (
          <Fragment>
            <span>On hand:</span> {text}
          </Fragment>
        )}
      </h3>
      {winner && <h3 className={classNameWinner}>You won this round</h3>}
    </Fragment>
  )
}

export default PlayerHand
