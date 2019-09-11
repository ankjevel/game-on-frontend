import React, { useState, useEffect } from 'react'

import SocketContext from './context'

export const SocketProvider = props => {
  const [value, setValue] = useState()

  useEffect(() => {
    const initConfig = async () => {
      console.log('init socket')

      setValue(state => ({
        ...state,
      }))
    }

    initConfig()
  }, [])

  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
