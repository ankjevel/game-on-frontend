import { UserSummary } from 'CAction'

import React, { SFC } from 'react'

import './ActionStatus.css'

export const ActionStatus: SFC<{
  className?: string
  status: UserSummary['status']
  winner: boolean
}> = ({ className: cn, status, winner }) => {
  const base = 'c_action-status'
  const className = `${base} ${base}_${status} ${
    winner ? `${base}_winner` : ''
  } ${cn || ''}`
  let text: string

  switch (status) {
    case 'allIn': {
      text = 'all in'
      break
    }
    case 'sittingOut': {
      text = 'out'
      break
    }
    case 'none': {
      text = ' '
      break
    }
    default: {
      text = status
    }
  }

  if (winner) {
    text = 'winner'
  }

  return (
    <div className={className}>
      <div>{text}</div>
    </div>
  )
}

export default ActionStatus
