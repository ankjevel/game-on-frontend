import React, { useContext } from 'react'
import socketContext from '../../context/Socket'
import userContext from '../../context/User'
import configContext from '../../context/Config'
import SignIn from '../SignIn'
import CreateGroup from '../CreateGroup'

export const App = () => {
  const config = useContext(configContext)
  const user = useContext(userContext)
  const socket = useContext(socketContext)

  const print = () => ({
    ...config,
    ...{
      userID: user.id,
      userGroup: user.group.id,
      socketID: socket.id,
      socketRoom: socket.room,
    },
  })

  return (
    <div className="app">
      <div className="flex mb-4">
        {user.id === '' ? (
          <SignIn />
        ) : user.group == null ? (
          <CreateGroup />
        ) : (
          <code className="app-title">
            {`${JSON.stringify(print(), null, 2)}`}
          </code>
        )}
      </div>
    </div>
  )
}

export default App
