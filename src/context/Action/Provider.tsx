import CContext from 'CAction'
import React, { useEffect, useState, useContext } from 'react'
import UserContext, { Context as User } from '../User'
import Context from './context'
import { list } from '../../utils/api'

export const ActionProvider = props => {
  const user = useContext<User>(UserContext)
  const [value, setValue] = useState<CContext>({
    action: undefined,
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case 'action': {
          changed.action = value
          break
        }
        default:
          return
      }

      setValue(state => ({ ...state, ...changed }))
    },
    refresh: async key => {
      switch (key) {
        case 'action': {
          if (
            value.action == null &&
            user.group != null &&
            user.group.action != null
          ) {
            const action = await list.get(user.group.action, 'action')

            if (!action) return

            setValue(state => ({ ...state, action }))
          }

          break
        }
        default:
          return
      }
    },
  })

  useEffect(() => {
    const apply = async () => {
      if (user.group == null) {
        if (value.action != null) {
          setValue(state => ({ ...state, action: undefined }))
        }
        return
      }
      if (user.group.action == null) {
        if (value.action != null) {
          setValue(state => ({ ...state, action: undefined }))
        }

        return
      }

      if (!value.action || value.action.id !== user.group.action) {
        const action = await list.get(user.group.action, 'action')

        if (!action) return

        setValue(state => ({ ...state, action }))
      }
    }

    apply()
  }, [value, user.group])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
