import React, { useState, useEffect } from 'react'

import Context from './context'

export const UserProvider = props => {
  const [value, setValue] = useState()

  useEffect(() => {
    const initConfig = async () => {
      console.log('init user')

      setValue(state => ({
        ...state,
      }))
    }

    initConfig()
  }, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default UserProvider
