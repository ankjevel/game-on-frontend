import React, { useState, useEffect } from 'react'
import Context from './context'

import { validate } from '../../utils/jwt'
import { setToken } from '../../utils/req'

export const UserProvider = props => {
  const [value, setValue] = useState({
    id: '',
    token: '',
    group: '',
    ready: false,
    setToken: token => {
      localStorage.setItem('token', token)
      setValue(state => ({ ...state, token }))
    },
    setJWT: ({ id }) => {
      setValue(state => ({ ...state, id }))
    },
    setGroup: group => {
      setValue(state => ({ ...state, group }))
    },
  })

  useEffect(() => {
    const initConfig = () => {
      const token: MaybeNull<string> = localStorage.getItem('token') || ''
      const group = localStorage.getItem('group') || ''
      const ready = true

      tokenValid: if (token) {
        const jwt = validate(token)

        if (!jwt) {
          break tokenValid
        }

        setToken(token)
        return setValue(state => ({
          ...state,
          ready,
          group,
          token,
          id: jwt.id,
        }))
      }

      return setValue(state => ({ ...state, ready }))
    }

    initConfig()
  }, [])

  return (
    <Context.Provider value={value}>
      {value == null || !value.ready ? null : props.children}
    </Context.Provider>
  )
}

export default UserProvider
