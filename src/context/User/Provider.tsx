import React, { useState, useEffect } from 'react'
import Context from './context'

import { validate } from '../../utils/jwt'
import { setToken } from '../../utils/req'

export const UserProvider = props => {
  const [value, setValue] = useState({
    id: '',
    token: '',
    setToken: token => {
      localStorage.setItem('token', token)
      setValue(state => ({ ...state, token }))
    },
    setJWT: jwt => {
      console.log('new JWT', jwt)
      setValue(state => ({ ...state, id: jwt.id }))
    },
  })

  useEffect(() => {
    const initConfig = () => {
      const token: MaybeNull<string> = localStorage.getItem('token')
      console.log(token)

      tokenValid: if (token) {
        const jwt = validate(token)
        console.log(jwt)

        if (jwt) {
          break tokenValid
        }

        setToken(token)
        return setValue(state => ({ ...state, token, id: jwt.id }))
      }

      return setValue(state => ({ ...state }))
    }

    initConfig()
  }, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default UserProvider
