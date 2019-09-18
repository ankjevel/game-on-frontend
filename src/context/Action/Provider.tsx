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
  })

  useEffect(() => {
    const apply = async () => {
      if (user.group == null) return
      if (user.group.action == null) return setValue(null)

      if (!value.action || value.action.id !== user.group.action) {
        const action = await list.get(user.group.action, 'action')

        if (!action) return

        setValue(state => ({ ...state, action }))
      }
    }

    apply()
  }, [value.action, user.group])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
