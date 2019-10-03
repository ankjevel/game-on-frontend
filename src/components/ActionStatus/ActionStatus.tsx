import { UserSummary } from 'CAction'
import React, { SFC } from 'react'

import './ActionStatus.css'

export const ActionStatus: SFC<{
  className?: string
  status: UserSummary['status']
  winner: boolean
}> = ({ className: cn, status, winner }) => {
  const className = `c_action-status ${status} ${winner ? 'winner' : ''} ${cn ||
    ''}`
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
