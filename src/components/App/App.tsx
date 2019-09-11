import React, { useContext } from 'react'

import socketContext from '../../context/Socket'
import userContext from '../../context/User'
import configContext from '../../context/Config'

import SignIn from '../SignIn'

export const App = () => {
  const config = useContext(configContext)
  const user = useContext(userContext)
  const socket = useContext(socketContext)
  const onSuccess = id => {
    console.log('onSuccess', id)
  }

  return (
    <div className="app">
      <div className="flex mb-4">
        {user.id === '' ? (
          <SignIn onSuccess={onSuccess} />
        ) : (
          <code className="app-title">
            {`${JSON.stringify(
              {
                ...config,
                ...{
                  ...user,
                  userID: user.id,
                },
                ...{
                  ...socket,
                  socketID: socket.id,
                },
              },
              null,
              2
            )}`}
          </code>
        )}
      </div>
    </div>
  )
}

export default App
