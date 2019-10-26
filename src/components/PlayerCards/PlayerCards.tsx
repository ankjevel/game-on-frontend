type Params = {
  className?: string
  cards?: UserSummary['cards']
}

import { UserSummary } from 'CAction'
import React, { memo } from 'react'

import './PlayerCards.css'

import { Card } from '@/components/Card'

export const PlayerCards = memo(
  ({ className: cn = '', cards }: Params) => (
    <div className={`c_player-cards ${cn}`.trim()}>
      {cards.map(card => (
        <Card className="card" key={`player-cards-${card}`} card={card} />
      ))}
    </div>
  ),
  (prevProps, nextProps) => {
    if (!nextProps) return false
    if (!prevProps || prevProps.cards == null) return true
    return JSON.stringify(prevProps.cards) === JSON.stringify(nextProps.cards)
  }
)

export default PlayerCards
