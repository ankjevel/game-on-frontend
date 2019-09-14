import React, { useContext } from 'react'
import socketContext from '../../context/Socket'
import userContext, { SetValue } from '../../context/User'
import * as api from '../../utils/api'

export const Group = () => {
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
    <div className="px-4 py-6">
      <div>
        <div className="w-full text-left p-2">
          <div className="text-gray-700 py-1 select-none">
            <span className="text-xs font-semibold">id: </span>
            <span className="text-sm">{user.id}</span>
          </div>
          <div className="text-gray-700 py-1 select-none">
            <span className="text-xs font-semibold">name: </span>
            <span className="text-sm">{user.name}</span>
          </div>
          <div className="text-gray-700 py-1 select-none">
            <span className="text-xs font-semibold">group: </span>
            <span className="text-sm">{user.group.name}</span>
          </div>
          <div className="text-gray-700 py-1">
            <span className="text-xs font-semibold select-none">
              group id:{' '}
            </span>
            <span className="text-sm">{user.group.id}</span>
          </div>
          <div className="text-gray-700 py-1 select-none">
            <span className="text-xs font-semibold">socket: </span>
            <span className="text-sm">{socket.id}</span>
          </div>
        </div>

        <table className="w-full text-left table-collapse select-none">
          <thead>
            <tr>
              <th className="text-xs font-semibold text-gray-700 p-2 bg-gray-100">
                Small blind
              </th>
              <th className="text-xs font-semibold text-gray-700 p-2 bg-gray-100">
                Big blind
              </th>
              <th className="text-xs font-semibold text-gray-700 p-2 bg-gray-100">
                Start sum
              </th>
              <th className="text-xs font-semibold text-gray-700 p-2 bg-gray-100">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            <tr>
              <td className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap">
                {user.group.blind.small}
              </td>
              <td className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap">
                {user.group.blind.big}
              </td>
              <td className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap">
                {user.group.startSum}
              </td>
              <td className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap">
                {user.group.owner === user.id ? 'true' : 'false'}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full text-left table-collapse select-none">
          <thead>
            <tr>
              <th className="text-xs font-semibold text-gray-700 p-2 bg-gray-100">
                users
              </th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            {user.group.users
              .filter(({ id }) => id !== user.id)
              .map(({ id }) => (
                <tr key={id}>
                  <td className="p-2 border-t border-gray-300 font-mono text-xs text-gray-700 whitespace-no-wrap">
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
  )
}

export default Group
