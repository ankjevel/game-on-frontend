type Params = {
  className?: string
  communityCards: CAction['communityCards']
}

import CAction from 'CAction'
import React, { memo } from 'react'

import './CommunityCards.css'

import { Card } from '@/components/Card'

export const CommunityCards = memo(
  ({ className: cn = '', communityCards }: Params) => (
    <div className={`c_community_cards ${cn}`.trim()}>
      {communityCards.map(card => (
        <Card card={card} className="card" key={`community-card-${card}`} />
      ))}
      {[...Array(5 - communityCards.length)].map((_, i) => (
        <div className="card none" key={`blank_card_${i}`} />
      ))}
    </div>
  ),
  (prevProps, nextProps) => {
    if (!nextProps) return false
    if (!prevProps || prevProps.communityCards == null) return true

    return prevProps.communityCards.length === nextProps.communityCards.length
  }
)

export default CommunityCards
