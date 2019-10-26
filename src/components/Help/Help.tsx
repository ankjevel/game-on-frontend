import React, { SFC } from 'react'

import './Help.css'
import { Action } from 'CAction'

const PREFIX = 'c_help'

export const Help: SFC<{
  bigID: string
  button: string
  round: Action['round']
  winners: string[][]
  userID: string
  users: {
    [id: string]: string
  }
  currentBig: number
  currentBet: number
  className?: string
}> = ({
  className: cn = '',
  bigID,
  button,
  users,
  round,
  userID,
  winners,
  currentBig,
  currentBet,
}) => {
  const inBettingRound = round === 0
  const inShowdown = round === 4
  const isButton = button === userID
  const isBig = bigID === userID
  const isWinner = winners && winners[0].includes(userID)
  const multipleWinners = winners && winners[0].length > 1

  const classes = [
    inBettingRound && 'in-betting-round',
    inShowdown && 'in-showdown',
    isButton && 'is-button',
    isBig && 'is-big',
    isWinner && 'is-winner',
    multipleWinners && 'multiple-winners',
  ]
    .filter(c => c)
    .map(c => `${PREFIX}-${c}`)

  let message = ''
  if (inBettingRound) {
    if (isButton) {
      message = `place your bet, or raise (${currentBig - currentBet} to join)`
    } else {
      message = `waiting for ${users[button]} to decide what to do`
    }
  } else if (inShowdown) {
    // in showdown
  } else {
    if (isBig && isButton) {
      message = 'you are the leader, check or raise'
    } else if (isButton) {
      if (currentBig === currentBet) {
        message =
          'You only need to check (not betting anything else) to be in the game'
      } else {
        message = `You need to call with ${currentBig -
          currentBet} to be in the game\nIf you raise, you will first call then raise`
      }
    } else {
      message = `Waiting for ${users[button]} to make their move`
    }
  }

  if (message === '') {
    classes.push(`${PREFIX}-hidden`)
  }

  const className = `${PREFIX} ${classes.join(' ')} ${cn}`.trim()

  return <div className={className}>{message}</div>
}

export default Help
