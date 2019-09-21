import { NewAction, CAction as CActionContext } from 'CAction'
import { User } from 'Api'

import React, { useContext, useState, Fragment } from 'react'

import './Action.css'

import Slider from 'rc-slider'
import SVG from 'react-inlinesvg'
import { IconArrowUp, IconArrowDown } from 'react-heroicons-ui'
import update from 'immutability-helper'

import api from '../../utils/api'
import userContext from '../../context/User'
import actionContext from '../../context/Action'
import Modal from '../Modal'

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

  const [usersLeft, setOrder] = useState([])

  const maxBet = (group.users || [{ sum: -1 }]).find(
    user => user.id === cUser.id
  ).sum

  const [input, setInput] = useState({
    raise: Math.min(2, maxBet),
  })

  const req = async (body: NewAction) => {
    setCallPending(true)
    await api.action.newAction(cAction.action.id, group.id, body)
  }

  const actions = {
    async check() {
      await req({
        type:
          currentBet === yourBet
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
    async winner(winners: string[]) {
      await req({
        type: 'winner',
        winners,
      })
    },
  }

  const changeOrder = (index: number, newIndex: number) => {
    const user = usersLeft[index]
    setOrder(
      update(usersLeft, {
        $splice: [[index, 1], [newIndex, 0, user]],
      })
    )
  }

  if (group == null || cAction == null || cAction.action == null) {
    return null
  }

  const currentBet = cAction.action.turn[cAction.action.big].bet
  const yourBet = cAction.action.turn[cUser.id].bet

  const userElement = (row: Row, key: string) => {
    return (
      <div
        key={key}
        className={`item ${cAction.action.button === row.id ? 'button' : ''}`}
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
        </div>
      </div>
    )
  }

  const usersRows: {
    left: Row[]
    right: Row[]
    top: Row[]
  } = group.users
    .filter(user => user.id !== cUser.id)
    .reduce(
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
            <div className="inline-block relative w-64">
              <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                <option>Who won?</option>
                <option>Option 2</option>
                <option>Option 3</option>
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
          ) : (
            <div className="w-full text-left align-baseline flex flex-col">
              <div className="w-full flex flex-col mb-4 pl-2 pr-2 pt-2">
                <h1>Who won?</h1>
                <div>
                  <p>
                    <small>
                      There are side-pots, so order needs to be specified
                    </small>
                  </p>
                </div>
              </div>
              {usersLeft.map(([key], index, array) => {
                const start = index == 0
                const end = index === array.length - 1
                const even = index % 2 === 0

                return (
                  <div
                    key={key}
                    className={`w-full flex flex-row pl-2 pr-2 pt-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap ${even &&
                      'bg-gray-100'}`}
                  >
                    <div className="pl-2 font-bold flex-grow-0 flex-shrink-0">
                      <span className="inline-block align-bottom w-full h-full">
                        {index + 1}
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
                          onClick={() => changeOrder(index, index + 1)}
                        />
                      )}
                    </div>
                    <div className="w-8 h-5 flex-grow-0 flex-shrink-0">
                      {!start && (
                        <IconArrowUp
                          className="cursor-pointer inline ml-2 w-6 h-4 hover:text-blue-500 fill-current text-gray-500 -mt-2"
                          height={5}
                          onClick={() => changeOrder(index, index - 1)}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
              <div className="w-full flex flex-col mb-4 pl-2 pr-2 pt-2">
                <button
                  type="button"
                  className="inline-block leave-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white text-base leading-none py-2 px-4 mt-4 border border-blue-500 hover:border-transparent rounded"
                  onClick={async event => {
                    event.preventDefault()

                    if (window.confirm('Is the order correct?') === false) {
                      return
                    }

                    await actions.winner(usersLeft.map(([key]) => key))

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
        <h2 className="absolute right-0 top-0 text-white p-4">
          round: {cAction.action.round}
        </h2>
      </div>

      <div className="users select-none z-0">
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
        <div>
          <div className="w-full text-left p-2 text-gray-700 flex flex-col">
            <div className="select-none">
              <div>current bet: {currentBet}</div>
              <div>your bet: {yourBet}</div>
              <div>pot: {cAction.action.pot}</div>
              <div>
                bank: {group.users.find(({ id }) => id === cUser.id).sum}
              </div>
            </div>
            {group.owner == cUser.id &&
              cAction.action.round === 4 &&
              !callPending && (
                <div className="w-full flex flex-row">
                  <button
                    type="button"
                    onClick={() => actions.draw()}
                    className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                  >
                    draw
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOrder(
                        Object.entries(cAction.action.turn).filter(
                          ([, value]) => value.status !== 'fold'
                        )
                      )

                      setModalEndIsVisible(!modalEndIsVisible)
                    }}
                    className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                  >
                    winner
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* {cAction.action.round !== 4 && !callPending && ( */}
      <div className="bottom z-10">
        <div className="container">
          <Fragment>
            <button
              onClick={() => actions.check()}
              type="button"
              className="bg-blue-400 hover:bg-blue-300 text-white font-semibold hover:text-white text-base
                      leading-none p-2 py-2 px-4 rounded"
            >
              {currentBet === yourBet
                ? cAction.action.round === 0
                  ? 'bet'
                  : 'check'
                : 'call'}
            </button>
            <button
              type="button"
              onClick={() => actions.fold()}
              className="bg-red-500 hover:bg-red-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
            >
              fold
            </button>
            <button
              type="button"
              disabled={input.raise === maxBet}
              onClick={async event => {
                event.preventDefault()

                const currentBank = cUser.group.users.find(
                  user => user.id === cUser.id
                ).sum

                if (input.raise >= currentBank) {
                  window.alert('maybe go all in?')
                  return
                }

                await actions.raise(input.raise)
              }}
              className={`bg-blue-500 hover:bg-blue-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded ${
                input.raise === maxBet ? 'disabled' : ''
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
              max={maxBet}
            />
            <h3 className="raise ">{input.raise}</h3>
            <button
              type="button"
              disabled={input.raise !== maxBet}
              onClick={() => actions.allIn()}
              className={`bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded ${
                input.raise !== maxBet ? 'disabled' : ''
              }`}
            >
              all-in
            </button>
          </Fragment>
        </div>
      </div>
      {/* )} */}
    </Fragment>
  )
}

export default Action
