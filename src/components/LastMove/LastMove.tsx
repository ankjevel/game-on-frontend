import CUser from 'CUser'
import CAction from 'CAction'

import React, { memo, Fragment } from 'react'

import './LastMove.css'

import { Chip } from '@/components/Chip'

const CLASS = 'c_last-move'

const what = (lastMove: CAction['lastMove']) => {
  switch (lastMove.type) {
    case 'allIn':
      return 'went all in'
    case 'bet':
      return 'placed bet'
    case 'call':
    case 'check':
    case 'fold':
      return `${lastMove.type}ed`
    case 'raise':
      return 'raised'
  }
}

const who = (id: string, you: string, users: CUser['users']) => {
  if (id === you) return 'you'
  return users[id]
}

const value = (lastMove: CAction['lastMove']) => {
  switch (lastMove.type) {
    case 'allIn':
    case 'raise':
      return (
        <Fragment>
          <Chip className={`${CLASS}-chip`} type="thin" />
          <small>{lastMove.value}</small>
        </Fragment>
      )
  }
  return null
}

export const LastMove = memo(
  ({
    className: cn = '',
    users,
    lastMove,
    you,
  }: {
    className?: string
    users: CUser['users']
    you: CUser['id']
    lastMove?: CAction['lastMove']
  }) => {
    if (!lastMove) {
      return null
    }

    return (
      <h3 className={`${CLASS} ${cn}`.trim()}>
        <span>Last move</span>
        {who(lastMove.userID, you, users)} {what(lastMove)} {value(lastMove)}
      </h3>
    )
  },
  (prevProps, nextProps) => {
    if (!nextProps) return false
    if (!prevProps || prevProps.lastMove == null) return true
    return prevProps.lastMove.userID === nextProps.lastMove.userID
  }
)

export default LastMove
