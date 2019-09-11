import React, { useState, useEffect } from 'react'
import Context from './context'

export const UserProvider = props => {
  const [value, setValue] = useState({ id: '' })

  useEffect(() => {
    const initConfig = async () => {
      setValue(state => ({
        ...state,
      }))
    }
    initConfig()
  }, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default UserProvider
