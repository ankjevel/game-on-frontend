import CContext, { SetValue } from './Types'

import React, { useState, useEffect } from 'react'
import Context from './context'
import * as api from '../../utils/api'

export const UserProvider = props => {
  const [value, setValue] = useState<CContext>({
    id: '',
    token: '',
    name: '',
    group: undefined,
    ready: false,
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case SetValue.Token: {
          changed.group = (await api.user.group()) || undefined
          changed.token = value
          break
        }

        case SetValue.Group: {
          changed.group = value
          break
        }

        case SetValue.JWT: {
          changed.name = value.name
          changed.id = value.id
          break
        }

        default:
          return
      }

      setValue(state => ({ ...state, ...changed }))
    },
  })

  useEffect(() => {
    const initConfig = async () => {
      const ready = true
      const token: MaybeNull<string> = localStorage.getItem('token') || ''
      const groupFromLocalStorage = localStorage.getItem('group') || undefined
      let group: MaybeUndefined<CContext['group']>

      tokenValid: if (token) {
        const jwt = api.validate(token)
        if (!jwt || (await api.user.validToken(token)) == null) {
          localStorage.removeItem('token')
          localStorage.removeItem('group')
          break tokenValid
        }

        api.setToken(token)

        if (groupFromLocalStorage) {
          try {
            group = JSON.parse(groupFromLocalStorage)
          } catch (error) {
            console.error(error)
            localStorage.removeItem('group')
          }
        } else {
          group = (await api.user.group()) || undefined
        }

        return setValue(state => ({
          ...state,
          ready,
          token,
          group,
          name: jwt.name,
          id: jwt.id,
        }))
      }

      return setValue(state => ({ ...state, ready }))
    }

    initConfig()
  }, [])

  useEffect(() => {
    const setValue = () => {
      if (!value.group) {
        localStorage.removeItem('group')
      } else {
        localStorage.setItem('group', JSON.stringify(value.group))
      }
    }
    setValue()
  }, [value.group])

  useEffect(() => {
    const setValue = () => {
      if (!value.token) {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', value.token)
      }
    }
    setValue()
  }, [value.token])

  return (
    <Context.Provider value={value}>
      {value == null || !value.ready ? null : props.children}
    </Context.Provider>
  )
}

export default UserProvider
