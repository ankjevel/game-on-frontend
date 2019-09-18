import React, { useContext, useState, Fragment } from 'react'

import api from '../../utils/api'

import userContext from '../../context/User'
import actionContext from '../../context/Action'

export const Action = () => {
  const cUser = useContext(userContext)
  const cAction = useContext(actionContext)
  const [group] = useState(cUser.group)
  const [users] = useState(cUser.users)

  const actions = {
    async check() {
      await api.action.newAction(cAction.action.id, group.id, {
        type: cAction.action.round === 0 ? 'bet' : 'check',
      })
    },
    async raise() {
      await api.action.newAction(cAction.action.id, group.id, {
        type: 'raise',
        value: 10,
      })
    },
    async fold() {
      await api.action.newAction(cAction.action.id, group.id, {
        type: 'fold',
      })
    },
    async allIn() {
      await api.action.newAction(cAction.action.id, group.id, {
        type: 'allIn',
      })
    },
    async draw() {
      await api.action.newAction(cAction.action.id, group.id, {
        type: 'draw',
      })
    },
  }

  if (group == null || cAction.action == null) {
    return null
  }

  return (
    <div className="px-4 py-6">
      <div>
        <div className="w-full text-left p-2 text-gray-700 flex flex-col">
          <h1>{group.name}</h1>
          <div>pot: {cAction.action.pot}</div>
          <div>bank: {group.users.find(({ id }) => id === cUser.id).sum}</div>
          <div>
            button:{' '}
            {cAction.action.button === cUser.id
              ? `it's your turn`
              : users[cAction.action.button]}
          </div>
          <div className="w-full flex flex-row">
            {cAction.action.button === cUser.id && (
              <Fragment>
                <button
                  onClick={() => actions.check()}
                  type="button"
                  className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
                >
                  check
                </button>
                <button
                  type="button"
                  onClick={() => actions.raise()}
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
            <button
              type="button"
              onClick={() => actions.draw()}
              className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
            >
              draw
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Action
