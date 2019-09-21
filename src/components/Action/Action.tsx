import { NewAction, CAction as CActionContext } from 'CAction'
import { User } from 'Api'

import React, { useContext, useState, Fragment } from 'react'
import SVG from 'react-inlinesvg'
import api from '../../utils/api'
import userContext from '../../context/User'
import actionContext from '../../context/Action'
import Modal from '../Modal'

type Row = {
  name: string
  id: User['id']
  action: CActionContext['action']['turn']
}

export const Action = () => {
  const cUser = useContext(userContext)
  const cAction = useContext(actionContext)
  const [group] = useState(cUser.group)
  const [users] = useState(cUser.users)

  const [modalEndIsVisible, setModalEndIsVisible] = useState(false)
  const [modalRaiseVisibile, setModalRaiseVisibile] = useState(false)
  const [callPending, setCallPending] = useState(false)

  const [input, setInput] = useState({
    raise: 0,
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

  if (group == null || cAction == null || cAction.action == null) {
    return null
  }

  const currentBet = cAction.action.turn[cAction.action.big].bet
  const yourBet = cAction.action.turn[cUser.id].bet

  const userElement = (row: Row, key: string) => {
    return (
      <div key={key} className="item">
        <h1>
          {cAction.action.button === row.id && (
            <SVG src={require('../../svg/poker-chip.svg')} />
          )}
          {row.name}
        </h1>
        <div>{row.action.bet}</div>
        <div>{row.action.status}</div>
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

        const top = i === half || (even && i === half - 1)

        object[top ? 'top' : left ? 'left' : 'right'].push({
          name,
          id: user.id,
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
      </Modal>

      <Modal
        isOpen={modalRaiseVisibile}
        onClose={() => setModalRaiseVisibile(!modalRaiseVisibile)}
      >
        <div className="inline-block">
          <form
            onSubmit={async event => {
              event.preventDefault()

              const currentBank = cUser.group.users.find(
                user => user.id === cUser.id
              ).sum

              if (input.raise >= currentBank) {
                window.alert('maybe go all in?')
                return
              }

              await actions.raise(input.raise)

              setModalRaiseVisibile(false)
            }}
          >
            <label htmlFor="raise" className="w-full mb-10 block">
              <h1>How much would you like to raise?</h1>
            </label>
            <input
              type="number"
              id="raise"
              name="raise"
              required={true}
              value={input.raise}
              onChange={event => {
                event.preventDefault()
                const value = event.target.valueAsNumber

                if (isNaN(value)) {
                  return
                }

                setInput({
                  ...input,
                  raise: value,
                })
              }}
              className="w-full bg-gray-100 rounded p-5"
            />
            <input type="submit" className="invisible" />
          </form>
        </div>
      </Modal>

      <div className="px-4 py-6">
        <h1 className="absolute left-0 top-0 text-white">{group.name}</h1>

        <div className="users z-10">
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

        <div>
          <div className="w-full text-left p-2 text-gray-700 flex flex-col">
            <div>current bet: {currentBet}</div>
            <div>your bet: {yourBet}</div>
            <div>round: {cAction.action.round}</div>
            <div>pot: {cAction.action.pot}</div>
            <div>bank: {group.users.find(({ id }) => id === cUser.id).sum}</div>

            {cAction.action.round !== 4 && !callPending && (
              <div className="w-full flex flex-row">
                {cAction.action.button === cUser.id && (
                  <Fragment>
                    <button
                      onClick={() => actions.check()}
                      type="button"
                      className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                    >
                      {currentBet === yourBet
                        ? cAction.action.round === 0
                          ? 'bet'
                          : 'check'
                        : 'call'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalRaiseVisibile(!modalRaiseVisibile)}
                      className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                    >
                      raise
                    </button>
                    <button
                      type="button"
                      onClick={() => actions.fold()}
                      className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                    >
                      fold
                    </button>
                    <button
                      type="button"
                      onClick={() => actions.allIn()}
                      className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                    >
                      all-in
                    </button>
                  </Fragment>
                )}
              </div>
            )}
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
                    onClick={() => setModalEndIsVisible(!modalEndIsVisible)}
                    className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                  >
                    winner
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Action
