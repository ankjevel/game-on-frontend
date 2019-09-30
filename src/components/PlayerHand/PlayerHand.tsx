import React, { SFC } from 'react'

import './PlayerHand.css'

import getText, { Hand } from '../../utils/hand'

export const PlayerHand: SFC<{
  className?: string
  hand: Hand
}> = ({ className: cn, hand }) => {
  const text = getText(hand) || ''
  const className = `c_player-hand ${cn}`.trim()

  return (
    <h3 className={className}>
      <span>On hand:</span> {text}
    </h3>
  )
}

export default PlayerHand
