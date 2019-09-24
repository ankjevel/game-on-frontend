import CContext from 'CAction'
import React, { useEffect, useState, useContext } from 'react'
import { useAlert } from 'react-alert'
import { list } from '../../utils/api'
import Context from './context'
import UserContext, { Context as User } from '../User'

export const ActionProvider = props => {
  const alert = useAlert()
  const user = useContext<User>(UserContext)
  const [value, setValue] = useState<CContext>({
    action: undefined,
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case 'action': {
          console.log('new action', value)
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

            alert.info('force refreshed game')

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
          alert.info('game ended')
          setValue(state => ({ ...state, action: undefined }))
        }
        return
      }

      if (user.group.action == null) {
        if (value.action != null) {
          alert.info('game ended')
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
  }, [value, user.group, alert])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
