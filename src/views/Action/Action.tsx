import { NewAction } from 'CAction'
import { Row } from 'ActionView'
import { Params } from 'Action'

import React, { useState, memo, useEffect } from 'react'

import './Action.css'

import Slider from 'rc-slider'

import api from '@/utils/api'
import Card from '@/components/Card'
import Chip from '@/components/Chip'
import User from '@/components/User'
import PlayerHand from '@/components/PlayerHand'
import SignOut from '@/components/SignOut'

export const Action = memo(
  ({
    actionID,
    bigID,
    button,
    communityCards,
    group,
    pot,
    round,
    sidePot = [],
    turn,
    userID,
    users,
    winners = [[]],
  }: Params) => {
    const [callPending, setCallPending] = useState(false)
    const userTurn = turn[userID]
    const userGroup = group.users.find(user => user.id === userID)
    const big = turn[bigID]
    const currentButton = button === userID ? 'You' : users[button]

    const [input, setInput] = useState({
      raise: Math.min(2, Math.max(userTurn.bet, 1)),
      raiseDirty: false,
    })
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

    const req = async (body: NewAction) => {
      setCallPending(true)
      await api.action.newAction(actionID, group.id, body)
      setCallPending(false)
    }

    const actions = {
      async check() {
        await req({
          type:
            round === 0 && big.bet === group.blind.big
              ? 'bet'
              : big.bet === userTurn.bet
              ? 'check'
              : 'call',
        })
      },
      async raise(value: number) {
        await req({ type: 'raise', value })
      },
      async fold() {
        await req({ type: 'fold' })
      },
      async allIn() {
        await req({ type: 'allIn' })
      },
      async confirm() {
        await req({ type: 'confirm' })
      },
    }

    let userIndex = group.users.findIndex(user => user.id === userID)
    let usersCopy = group.users.slice(0)

    usersCopy.splice(
      0,
      0,
      ...usersCopy.splice(userIndex, group.users.length - userIndex).slice(1)
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

    usersCopy = undefined
    userIndex = undefined

    const betMax = userGroup.sum - (big.bet - userTurn.bet)
    const chips = big.bet === group.blind.big ? 2 : 3 + sidePot.length
    const sidePots = sidePot
      .filter(({ id }) => id !== bigID)
      .map(({ sum }) => sum)

    return (
      <div className={`c_action round-${round}`}>
        <div className="main-top">
          <h1 className="title">{group.name}</h1>
          <SignOut className="sign-out" />
        </div>

        {isSmall ? (
          <div className="users-sm">
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
          </div>
        ) : (
          <div className="users-lg">
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
          </div>
        )}

        <div className="main">
          <div className={`${sidePots.length ? 'has-side-pots' : ''}`}>
            <div className="table">
              <div className="bets">
                {sidePots.map((sum, i) => (
                  <h1 className="bet side-pot" key={`sidepot-${i}`}>
                    <span className="chips">
                      <Chip className="chip" type="thin" />
                      <Chip className="chip" type="thin" />
                      <Chip className="chip" type="thin" />
                    </span>
                    {sum}
                  </h1>
                ))}
                <h1 className="bet">
                  <span className="chips">
                    {[...Array(chips)].map((_, i) => (
                      <Chip key={`chip-${i}`} className="chip" type="thin" />
                    ))}
                  </span>
                  {big.bet}
                </h1>
                <h3 className="pot key-value">
                  <span>Pot</span> {pot}
                </h3>
              </div>
              <div className="holder">
                <div className="cards">
                  {communityCards.map(card => (
                    <Card
                      card={card}
                      className="card"
                      key={`community-card-${card}`}
                    />
                  ))}
                  {[...Array(5 - communityCards.length)].map((_, i) => (
                    <div className="card none" key={`blank_card_${i}`} />
                  ))}
                </div>
              </div>
              <div className="you">
                <h3 className="bet key-value">
                  <span>Your bet</span> {userTurn.bet}
                </h3>
                <h3 className="bank key-value">
                  <span>Bank</span> {userGroup.sum}
                </h3>
                <PlayerHand
                  className="hand"
                  hand={userTurn.hand}
                  winner={winners[0].includes(userID)}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bottom ${button === userID ? 'turn' : ''} ${
            round === 4 ? 'showdown' : ''
          }`}
        >
          <div className="player-cards">
            {(userTurn.cards || ([] as string[])).map(card => (
              <Card className="card" key={`player-cards-${card}`} card={card} />
            ))}
          </div>
          {round === 4 && userTurn.status !== 'confirm' && (
            <div className="confirm">
              <button
                type="button"
                onClick={() => actions.confirm()}
                disabled={callPending}
                className="button"
              >
                Start new round
              </button>
            </div>
          )}

          <div className={`holder${betMax <= 0 ? ' only-all-in' : ''}`}>
            <div className="current-button">
              <h3 className="key-value">
                <span>Current Button</span> {currentButton}
              </h3>
            </div>
            <button
              onClick={() => !callPending && actions.check()}
              disabled={callPending}
              type="button"
              className={`button button-bet-call${
                callPending ? ' disabled' : ''
              }`.trim()}
            >
              {round === 0 && big.bet === group.blind.big
                ? 'bet'
                : big.bet === userTurn.bet
                ? 'check'
                : 'call'}
            </button>
            <button
              type="button"
              disabled={callPending}
              onClick={() => !callPending && actions.fold()}
              className={`button button-fold${
                callPending ? ' disabled' : ''
              }`.trim()}
            >
              fold
            </button>
            <button
              type="button"
              disabled={
                callPending || input.raiseDirty || input.raise === userTurn.bet
              }
              onClick={async event => {
                event.preventDefault()

                if (callPending || input.raiseDirty || input.raise >= 0) {
                  return
                }

                if (input.raise >= userGroup.sum) {
                  window.alert('maybe go all in?')
                  return
                }

                await actions.raise(input.raise)
              }}
              className={`button button-raise${
                callPending || input.raiseDirty || input.raise === big.bet
                  ? ' disabled'
                  : ''
              }${betMax <= 0 || input.raise >= betMax ? ' hidden' : ''}`.trim()}
            >
              raise
            </button>
            <button
              type="button"
              disabled={callPending || input.raiseDirty || input.raise < betMax}
              onClick={() => !callPending && actions.allIn()}
              className={`button button-all-in ${
                input.raise < betMax ? 'hidden' : ''
              }${
                callPending || input.raiseDirty || input.raise < betMax
                  ? ' disabled'
                  : ''
              }`.trim()}
            >
              all-in
            </button>
            <div className="raise">
              <strong>Raise:</strong>
              <input
                value={input.raise}
                type="number"
                max={betMax}
                onChange={event => {
                  event.preventDefault()
                  const {
                    target: { valueAsNumber: raise },
                  } = event

                  if (isNaN(raise)) {
                    return setInput({
                      ...input,
                      raiseDirty: true,
                      raise: '' as any,
                    })
                  }

                  setInput({
                    ...input,
                    raiseDirty: raise > betMax || raise <= 0,
                    raise,
                  })
                }}
              />
            </div>
            <Slider
              className="slider"
              value={input.raise}
              onChange={raise => {
                setInput({
                  ...input,
                  raiseDirty: raise > betMax || raise <= 0,
                  raise,
                })
              }}
              max={betMax}
            />
          </div>
        </div>
      </div>
    )
  }
)

export default Action
