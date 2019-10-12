import { NewAction } from 'CAction'
import { Row } from 'ActionView'
import { Params } from 'Action'

import React, { useState, memo } from 'react'

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
    turn,
    communityCards,
    round,
    pot,
    button,
    actionID,
    bigID,
    userID,
    group,
    users,
    winners,
  }: Params) => {
    const [callPending, setCallPending] = useState(false)
    const placeholders = [...Array(5)].map(_ => null)
    const userTurn = turn[userID]
    const userGroup = group.users.find(user => user.id === userID)
    const big = turn[bigID]

    const [input, setInput] = useState({ raise: Math.min(2, userTurn.bet) })

    const req = async (body: NewAction) => {
      setCallPending(true)
      await api.action.newAction(actionID, group.id, body)
      setCallPending(false)
    }

    const actions = {
      async check() {
        await req({
          type:
            big.bet === userTurn.bet ? (round === 0 ? 'bet' : 'check') : 'call',
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

    return (
      <div className="c_action">
        <div className="main-top">
          <h1 className="title">{group.name}</h1>
          <SignOut className="sign-out" />
        </div>

        <div className="users">
          <div className="left">
            {usersRows.left.reverse().map((user, i) => (
              <User
                key={`left-${i}`}
                position="left"
                row={user}
                bigID={bigID}
                round={round}
                button={button}
                winner={(winners || [[]])[0].includes(user.id)}
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
                winner={(winners || [[]])[0].includes(user.id)}
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
                winner={(winners || [[]])[0].includes(user.id)}
              />
            ))}
          </div>
        </div>

        <div className="main">
          <div>
            <div className="table">
              <div className="bets">
                <h1 className="bet">
                  <Chip className="chip" />
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

                <div className="placeholders">
                  {placeholders.map((_, i) => (
                    <div className="card" key={`placeholder_${i}`} />
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
                  winner={(winners || [[]])[0].includes(userID)}
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
          <div className="holder">
            <button
              onClick={() => !callPending && actions.check()}
              disabled={callPending}
              type="button"
              className="bg-blue-400 hover:bg-blue-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded-l"
            >
              {big.bet === userTurn.bet
                ? round === 0
                  ? 'bet'
                  : 'check'
                : 'call'}
            </button>
            <button
              type="button"
              disabled={callPending}
              onClick={() => !callPending && actions.fold()}
              className="bg-red-500 hover:bg-red-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4"
            >
              fold
            </button>
            <button
              type="button"
              disabled={callPending || input.raise === userTurn.bet}
              onClick={async event => {
                event.preventDefault()

                if (callPending) {
                  return
                }

                if (input.raise >= userGroup.sum) {
                  window.alert('maybe go all in?')
                  return
                }

                await actions.raise(input.raise)
              }}
              className={`bg-blue-500 hover:bg-blue-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded-r ${
                input.raise === big.bet ? 'disabled' : ''
              }`}
            >
              raise
            </button>
            <Slider
              className="slider"
              value={input.raise}
              onChange={value => {
                setInput({
                  ...input,
                  raise: value,
                })
              }}
              min={1}
              max={userGroup.sum - (big.bet - userTurn.bet)}
            />
            <h3 className="raise select-none">
              <strong>Raise:</strong> {input.raise}
            </h3>
            <button
              type="button"
              disabled={
                callPending ||
                input.raise < userGroup.sum - (big.bet - userTurn.bet)
              }
              onClick={() => !callPending && actions.allIn()}
              className={`bg-green-500 hover:bg-green-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded ${
                input.raise < userGroup.sum - (big.bet - userTurn.bet)
                  ? 'disabled'
                  : ''
              }`}
            >
              all-in
            </button>
          </div>
        </div>
      </div>
    )
  }
)

export default Action
