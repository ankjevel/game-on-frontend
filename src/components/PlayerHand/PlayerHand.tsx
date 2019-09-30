import React, { SFC } from 'react'

import './PlayerHand.css'

import getText, { Hand } from '../../utils/hand'

export const PlayerHand: SFC<{
  className?: string
  hand: Hand
}> = ({ className: cn, hand }) => {
  const text = getText(hand) || ''
  const className = `player-hand ${cn}`.trim()

  return <div className={className}>{text}</div>
}

export default PlayerHand
