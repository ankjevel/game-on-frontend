import { Row } from 'ActionView'
import CAction from 'CAction'
import CUser from 'CUser'

import React, { memo, Fragment, useState, useEffect } from 'react'

import './Users.css'

import User from '@/components/User'

export const Users = memo(
  ({
    className: cn = '',
    groupUsers,
    userID,
    users,
    turn,
    bigID,
    round,
    button,
    winners,
    sidePot,
  }: {
    className?: string
    bigID: CAction['big']
    button: CAction['button']
    groupUsers: CUser['group']['users']
    round: CAction['round']
    sidePot?: CAction['sidePot']
    turn: CAction['turn']
    userID: CUser['id']
    users: CUser['users']
    winners?: CAction['winners']
  }) => {
    const [isSmall, setIsSmall] = useState(window.innerWidth < 1024)

    useEffect(() => {
      let handler: any

      const resize = () => {
        clearTimeout(handler)
        handler = setTimeout(() => {
          setIsSmall(window.innerWidth < 1024)
        }, 25)
      }

      window.addEventListener('resize', resize)
      return () => {
        clearTimeout(handler)
        window.removeEventListener('resize', resize)
      }
    }, [])

    let userIndex = groupUsers.findIndex(user => user.id === userID)
    let usersCopy = groupUsers.slice(0)

    usersCopy.splice(
      0,
      0,
      ...usersCopy.splice(userIndex, groupUsers.length - userIndex).slice(1)
    )

    const usersRows: {
      left: Row[]
      right: Row[]
      top: Row[]
    } = usersCopy.reduce(
      (object, user, i, { length }) => {
        const name = users[user.id]
        const action = turn[user.id]

        const half = Math.floor(length / 2)
        const even = length % 2 === 0
        const left = i < half

        const top = !even && i === half

        object[top ? 'top' : left ? 'left' : 'right'].push({
          ...user,
          name,
          action,
        })

        return object
      },
      {
        left: [],
        right: [],
        top: [],
      }
    )

    const className = ['c_users', `c_users-${isSmall ? 'sm' : 'lg'}`, cn]
      .filter(c => c)
      .join(' ')

    usersCopy = undefined
    userIndex = undefined

    return (
      <div className={className}>
        {isSmall ? (
          <Fragment>
            {[
              ...usersRows.left.reverse(),
              ...usersRows.top,
              ...usersRows.right,
            ].map((user, i) => (
              <User
                key={`users-sm-${i}`}
                row={user}
                bigID={bigID}
                round={round}
                button={button}
                winner={winners[0].includes(user.id)}
                sidePot={sidePot.find(({ id }) => id === user.id)}
              />
            ))}
          </Fragment>
        ) : (
          <Fragment>
            <div className="left">
              {usersRows.left.reverse().map((user, i) => (
                <User
                  key={`left-${i}`}
                  position="left"
                  row={user}
                  bigID={bigID}
                  round={round}
                  button={button}
                  winner={winners[0].includes(user.id)}
                  sidePot={sidePot.find(({ id }) => id === user.id)}
                />
              ))}
            </div>
            <div className="top">
              {usersRows.top.map((user, i) => (
                <User
                  key={`top-${i}`}
                  position="top"
                  row={user}
                  bigID={bigID}
                  round={round}
                  button={button}
                  winner={winners[0].includes(user.id)}
                  sidePot={sidePot.find(({ id }) => id === user.id)}
                />
              ))}
            </div>
            <div className="right">
              {usersRows.right.map((user, i) => (
                <User
                  key={`right-${i}`}
                  position="right"
                  row={user}
                  bigID={bigID}
                  round={round}
                  button={button}
                  winner={winners[0].includes(user.id)}
                  sidePot={sidePot.find(({ id }) => id === user.id)}
                />
              ))}
            </div>
          </Fragment>
        )}
      </div>
    )
  }
)

export default Users
