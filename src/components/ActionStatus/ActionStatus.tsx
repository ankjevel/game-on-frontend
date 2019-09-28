import { UserSummary } from 'CAction'
import React, { SFC } from 'react'

import './ActionStatus.css'

export const ActionStatus: SFC<{
  className?: string
  status: UserSummary['status']
}> = ({ className: cn, status }) => {
  const className = `action-status ${status} ${cn || ''}`
  let text: string

  switch (status) {
    case 'allIn': {
      text = 'all in'
      break
    }
    case 'sittingOut': {
      text = 'sitting out'
      break
    }
    case 'none': {
      text = ''
      break
    }
    default: {
      text = status
    }
  }

  return (
    <div className={className}>
      <h3>{text}</h3>
    </div>
  )
}

export default ActionStatus
