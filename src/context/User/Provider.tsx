import React, { useState, useEffect } from 'react'

import UserContext from './context'

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

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  )
}

export default UserProvider
