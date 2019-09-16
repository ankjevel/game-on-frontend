import React, { useContext, useState } from 'react'

import userContext from '../../context/User'
import actionContext from '../../context/Action'

export const Action = () => {
  const user = useContext(userContext)
  const action = useContext(actionContext)
  const [group] = useState(user.group)
  const [users] = useState(user.users)

  if (user.group == null || action == null) {
    return null
  }

  return (
    <div className="px-4 py-6">
      <div>
        <div className="w-full text-left p-2 text-gray-700 flex flex-col">
          <h1>{user.group.name}</h1>
          <div>pot: {action.pot}</div>
          <div>
            bank: {user.group.users.find(({ id }) => id === user.id).sum}
          </div>
          <div>
            button:{' '}
            {action.button === user.id
              ? `it's your turn`
              : users[action.button]}
          </div>
          {action.button === user.id && (
            <div className="w-full flex flex-row">
              <button
                type="button"
                className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
              >
                check
              </button>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
              >
                raise
              </button>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
              >
                fold
              </button>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-300 text-white font-semibold hover:text-white text-base leading-none p-2 py-2 px-4 rounded"
              >
                all-in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Action
