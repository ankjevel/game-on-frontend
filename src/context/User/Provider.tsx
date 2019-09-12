import React, { useState, useEffect } from 'react'
import Context from './context'

import { validate } from '../../utils/jwt'
import req, { setToken } from '../../utils/req'

export const UserProvider = props => {
  const [value, setValue] = useState({
    id: '',
    token: '',
    group: '',
    ready: false,
    setToken: async token => {
      localStorage.setItem('token', token)

      const res = await req({ url: '/user/group' })
      console.log(res)

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
    const initConfig = async () => {
      const token: MaybeNull<string> = localStorage.getItem('token') || ''
      const group = localStorage.getItem('group') || ''
      const ready = true

      tokenValid: if (token) {
        const jwt = validate(token)

        if (!jwt) {
          break tokenValid
        }

        setToken(token)

        const res = await req({ url: '/user/group' })
        console.log({ res })

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
