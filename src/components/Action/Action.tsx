import { NewAction, CAction as CActionContext } from 'CAction'
import { User } from 'Api'
import { UserSummary } from 'CAction'

import React, { useContext, useState, Fragment } from 'react'

import './Action.css'

import Slider from 'rc-slider'
import SVG from 'react-inlinesvg'
import { IconArrowUp, IconArrowDown } from 'react-heroicons-ui'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import api from '../../utils/api'
import userContext from '../../context/User'
import actionContext from '../../context/Action'
import Modal from '../Modal'
import Card from '../Card'

type Row = {
  name: string
  id: User['id']
  sum: number
  action: CActionContext['action']['turn']
}

export const Action = () => {
  const cUser = useContext(userContext)
  const cAction = useContext(actionContext)

  const [group] = useState(cUser.group)
  const [users] = useState(cUser.users)
  const [modalEndIsVisible, setModalEndIsVisible] = useState(false)
  const [callPending, setCallPending] = useState(false)
  const [usersLeft, setOrder] = useState(
    Object.entries(cAction.action.turn).filter(
      ([, value]) => value.status !== 'fold'
    )
  )
  const [winner, setWinner] = useState(usersLeft[0][0])
  const [winnerOrder, setWinnerOrder] = useState(
    usersLeft.slice().map(x => [x[0]])
  )
  const [placeholders] = useState([...Array(5)].map(_ => null))
  const [userTurn] = useState(cAction.action.turn[cUser.id])
  const [userGroup] = useState(group.users.find(user => user.id === cUser.id))
  const [big] = useState(cAction.action.turn[cAction.action.big])
  const [input, setInput] = useState({ raise: Math.min(2, userTurn.bet) })

  const req = async (body: NewAction) => {
    setCallPending(true)
    await api.action.newAction(cAction.action.id, group.id, body)
  }

  const actions = {
    async check() {
      await req({
        type:
          big.bet === userTurn.bet
            ? cAction.action.round === 0
              ? 'bet'
              : 'check'
            : 'call',
      })
    },
    async raise(value: number) {
      await req({
        type: 'raise',
        value,
      })
    },
    async fold() {
      await req({
        type: 'fold',
      })
    },
    async allIn() {
      await req({
        type: 'allIn',
      })
    },
    async draw() {
      await req({
        type: 'draw',
      })
    },
    async winner(order: string[][]) {
      await req({
        type: 'winner',
        order,
      })
    },
  }

  const changeWinnerOrder = (
    index: number,
    userID: User['id'],
    newIndex: number
  ) => {
    const copy = JSON.parse(JSON.stringify(winnerOrder.slice(0)))
    const userIndex = copy[index].findIndex(id => id === userID)
    const user = copy[index].splice(userIndex, 1).pop()

    copy[newIndex].push(user)

    setWinnerOrder(copy)
  }

  const userElement = (row: Row, key: string) => {
    return (
      <div
        key={key}
        className={`item ${
          cAction.action.button === row.id && cAction.action.round !== 4
            ? 'button'
            : ''
        }`}
      >
        <div className="player">
          <div className="bet-and-action">
            <div className="bet">
              {cAction.action.big === row.id && (
                <SVG className="big" src={require('../../svg/chip.svg')} />
              )}
              <SVG src={require('../../svg/chip.svg')} /> {row.action.bet}
            </div>
            <div className="action">{row.action.status}</div>
          </div>
          <div className="info">
            <h2 className="name">{row.name}</h2>
            <div>{row.sum}</div>
          </div>
          <div className="cards">
            {Array.isArray(row.action.cards) &&
              row.action.cards.map(card => (
                <Card key={`player-${card}`} card={card} />
              ))}
          </div>
        </div>
      </div>
    )
  }

  let userIndex = group.users.findIndex(user => user.id === cUser.id)
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
      const action = cAction.action.turn[user.id]

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
    <Fragment>
      <Modal
        isOpen={modalEndIsVisible}
        onClose={() => setModalEndIsVisible(!modalEndIsVisible)}
      >
        <div className="">
          {Object.values(cAction.action.turn).findIndex(
            action => action.status === 'allIn'
          ) === -1 ? (
            <div className="inline-block">
              <div className="w-full mb-4 pl-2 pr-2 pt-2">
                <h1>Who won?</h1>
              </div>
              <div className="inline-block relative w-64">
                <select
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={winner}
                  onChange={event => {
                    event.preventDefault()
                    const {
                      target: { value },
                    } = event

                    if (!value || !usersLeft.find(([key]) => key === value)) {
                      return
                    }

                    setWinner(value)
                  }}
                >
                  {usersLeft
                    .filter(([, { status }]) => status !== 'fold')
                    .map(([key]) => (
                      <option value={key} key={key}>
                        {users[key]}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="w-full flex flex-col mb-4 pl-2 pr-2 pt-2">
                <button
                  type="button"
                  className="inline-block leave-button bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-base leading-none py-2 px-4 mt-4 border border-blue-500 hover:border-transparent rounded"
                  onClick={async event => {
                    event.preventDefault()
                    if (
                      window.confirm(
                        `Is the selection correct? (${users[winner]})`
                      ) === false
                    ) {
                      return
                    }
                    await actions.winner([[winner]])
                    setModalEndIsVisible(!modalEndIsVisible)
                  }}
                >
                  Declare winner
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full text-left align-baseline flex flex-col">
              <div className="w-full flex flex-col mb-4 pl-2 pr-2 pt-2">
                <h1>Who won?</h1>
                <p>
                  <small>
                    There are side-pots, so order needs to be specified
                  </small>
                </p>
              </div>
              {winnerOrder.map((keys, i, array) => {
                const start = i == 0
                const end = i === array.length - 1

                return (
                  <Fragment key={`main-${i}`}>
                    {keys.map((key, ii) => {
                      const actualIndex = array
                        .slice(0, i + 1)
                        .reduce((index, current) => {
                          const indexOf = current.indexOf(key)
                          if (indexOf === -1) {
                            return index + current.length
                          }
                          return index + indexOf
                        }, 1)
                      const even = actualIndex % 2 === 0
                      const index = ii === 0 ? `${actualIndex}` : '.'
                      return (
                        <div
                          key={`order-${key}`}
                          className={`w-full flex flex-row pl-2 pr-2 pt-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap ${even &&
                            'bg-gray-100'}`}
                        >
                          <div className="pl-2 font-bold flex-grow-0 flex-shrink-0">
                            <span className="inline-block align-bottom w-full h-full">
                              {index}
                            </span>
                          </div>

                          <div className="flex-grow-1 w-full pl-2 pr-4">
                            <span className="inline-block align-bottom w-full h-full">
                              {users[key]}
                            </span>
                          </div>

                          <div className="w-8 h-5 flex-grow-0 flex-shrink-0">
                            {!end && (
                              <IconArrowDown
                                className="cursor-pointer inline ml-2 w-6 h-4 hover:text-blue-500 fill-current text-gray-500 -mt-2"
                                height={5}
                                onClick={() => changeWinnerOrder(i, key, i + 1)}
                              />
                            )}
                          </div>
                          <div className="w-8 h-5 flex-grow-0 flex-shrink-0">
                            {!start && (
                              <IconArrowUp
                                className="cursor-pointer inline ml-2 w-6 h-4 hover:text-blue-500 fill-current text-gray-500 -mt-2"
                                height={5}
                                onClick={() => changeWinnerOrder(i, key, i - 1)}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </Fragment>
                )
              })}
              <div className="w-full flex flex-col mb-4 pl-2 pr-2 pt-2">
                <button
                  type="button"
                  className="inline-block leave-button bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-base leading-none py-2 px-4 mt-4 border border-blue-500 hover:border-transparent rounded"
                  onClick={async event => {
                    event.preventDefault()

                    if (window.confirm('Is the order correct?') === false) {
                      return
                    }

                    await actions.winner(
                      winnerOrder.filter(order => order.length > 0)
                    )

                    setModalEndIsVisible(!modalEndIsVisible)
                  }}
                >
                  Accept order
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div className="top absolute select-none inset-0 z-0">
        <h1 className="absolute left-0 top-0 text-white p-4">{group.name}</h1>
      </div>

      <div className="users">
        <div className="left">
          {usersRows.left.map((user, i) => userElement(user, `left-${i}`))}
        </div>
        <div className="top">
          {usersRows.top.map((user, i) => userElement(user, `top-${i}`))}
        </div>
        <div className="right">
          {usersRows.right.map((user, i) => userElement(user, `right-${i}`))}
        </div>
      </div>

      <div className="main px-4 py-6 z-10">
        <div className="w-full text-left p-2 text-gray-700 flex flex-col">
          <div className="table">
            <div className="bets">
              <h1 className="bet">
                <SVG className="chip" src={require('../../svg/chip.svg')} />
                {big.bet}
              </h1>
              <h3 className="pot">
                <strong>Pot:</strong> {cAction.action.pot}
              </h3>
            </div>
            <div className="holder">
              <TransitionGroup className="cards">
                {cAction.action.communityCards.map(card => (
                  <CSSTransition
                    classNames="community-card"
                    timeout={500}
                    key={`community-card-${card}`}
                  >
                    <span>
                      <Card card={card} />
                    </span>
                  </CSSTransition>
                ))}
                {[...Array(5 - cAction.action.communityCards.length)].map(
                  (_, i) => (
                    <div className="card" key={`blank_card_${i}`} />
                  )
                )}
              </TransitionGroup>
              <div className="placeholders">
                {placeholders.map((_, i) => (
                  <div className="card" key={`placeholder_${i}`} />
                ))}
              </div>
            </div>
            <div className="you">
              <h3 className="bet">
                <strong>Bet:</strong> {userTurn.bet}
              </h3>
              <h3 className="bank">
                <strong>Bank:</strong> {userGroup.sum}
              </h3>
            </div>
          </div>

          {group.owner == cUser.id &&
            cAction.action.round === 4 &&
            !callPending && (
              <div className="w-full flex flex-row">
                <button
                  type="button"
                  onClick={() => actions.draw()}
                  className="bg-green-500 hover:bg-green-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                >
                  draw
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const unfolded = Object.entries(cAction.action.turn).filter(
                      ([, value]) => value.status !== 'fold'
                    )

                    setOrder(unfolded)
                    setWinnerOrder(unfolded.slice().map(x => [x[0]]))

                    setModalEndIsVisible(!modalEndIsVisible)
                  }}
                  className="bg-green-500 hover:bg-green-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                >
                  winner
                </button>
              </div>
            )}
        </div>
      </div>

      <div
        className={`bottom animated ${
          cAction.action.button === cUser.id ? 'turn' : ''
        } ${cAction.action.round === 4 ? 'showdown' : ''}`}
      >
        <div className="player-cards">
          {(userTurn.cards || ([] as string[])).map(card => (
            <Card key={`player-cards-${card}`} card={card} />
          ))}
        </div>
        <div className="holder">
          <button
            onClick={() => !callPending && actions.check()}
            disabled={callPending}
            type="button"
            className="bg-blue-400 hover:bg-blue-300 text-white hover:text-white text-base leading-none p-2 py-2 px-4 rounded-l"
          >
            {big.bet === userTurn.bet
              ? cAction.action.round === 0
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
    </Fragment>
  )
}

export default Action
