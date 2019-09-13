import React, { useContext } from 'react'
import socketContext from '../../context/Socket'
import userContext, { SetValue } from '../../context/User'
import SignIn from '../SignIn'
import CreateOrJoinGroup from '../CreateOrJoinGroup'
import * as api from '../../utils/api'

export const App = () => {
  const user = useContext(userContext)
  const socket = useContext(socketContext)

  const leave = async event => {
    event.preventDefault()

    if (!(await api.group.leave(user.group.id))) {
      return
    }

    user.setValue(SetValue.Group, undefined)
  }

  return (
    <div className="app flex items-center justify-center">
      <div className="self-center auto l-w-1/2 s-w-full m-w-full rounded overflow-hidden shadow-lg bg-white">
        {user.id === '' ? (
          <SignIn />
        ) : user.group == null ? (
          <CreateOrJoinGroup />
        ) : (
          <div className="px-4 py-6">
            <div>
              <div className="w-full text-left p-2">
                <div className="text-gray-700 py-2">
                  <span className="text-sm font-semibold">id: </span>
                  {user.id}
                </div>
                <div className="text-gray-700 py-2">
                  <span className="text-sm font-semibold">name: </span>
                  {user.name}
                </div>
                <div className="text-gray-700 py-2">
                  <span className="text-sm font-semibold">group: </span>
                  {user.group.name}
                  {user.group.owner === user.id && (
                    <span className="text-sm font-semibold"> Owner</span>
                  )}
                </div>
                <div className="text-gray-700 py-2">
                  <span className="text-sm font-semibold">group id: </span>
                  {user.group.id}
                </div>

                <div className="text-gray-700 py-2">
                  <span className="text-sm font-semibold">socket: </span>
                  {socket.id}
                </div>
              </div>

              <table className="w-full text-left table-collapse">
                <tbody className="align-baseline">
                  {user.group.users.map(({ id }) => (
                    <tr>
                      <td className="p-2 border-t border-gray-300 font-mono text-xs text-purple-700 whitespace-no-wrap">
                        {id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4">
              <button
                className="leave-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={leave}
              >
                Leave group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
