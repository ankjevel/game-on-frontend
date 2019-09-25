import React, { SFC } from 'react'

import { html, isRed } from '../../utils/card'

import './Card.css'

export const Card: SFC<{
  card: string
}> = props => (
  <div
    className={`card ${isRed(props.card) ? 'text-red-500' : 'text-gray-700'}`}
    dangerouslySetInnerHTML={html(props.card)}
  />
)

export default Card
