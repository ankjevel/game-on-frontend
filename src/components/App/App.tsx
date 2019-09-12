import React, { useContext } from 'react'
import socketContext from '../../context/Socket'
import userContext from '../../context/User'
import SignIn from '../SignIn'
import CreateOrJoinGroup from '../CreateOrJoinGroup'

export const App = () => {
  const user = useContext(userContext)
  const socket = useContext(socketContext)

  const leave = event => {
    event.preventDefault()
    console.log('leave')
  }

  return (
    <div className="app flex items-center justify-center">
      <div className="self-center auto w-1/2 rounded overflow-hidden shadow-lg bg-white">
        {user.id === '' ? (
          <SignIn />
        ) : user.group == null ? (
          <CreateOrJoinGroup />
        ) : (
          <div className="px-4 py-6">
            <div>
              <p>id: {user.id}</p>
              <p>name: {user.name}</p>
              <p>group: {user.group.name}</p>
              <p>socket: {socket.id}</p>
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
