import CContext, { Action } from 'CAction'
import React, { useEffect, useState, useContext } from 'react'
import { useAlert } from 'react-alert'
import { list } from '../../utils/api'
import Context from './context'
import UserContext, { Context as User } from '../User'

const getProp = (action: Action) => {
  if (!action) {
    return {}
  }

  return {
    big: action.big != null ? action.big : undefined,
    button: action.button != null ? action.button : undefined,
    communityCards:
      action.communityCards != null ? action.communityCards : undefined,
    id: action.id != null ? action.id : undefined,
    pot: action.pot != null ? action.pot : undefined,
    round: action.round != null ? action.round : undefined,
    turn: action.turn != null ? action.turn : undefined,
    sidePot: action.sidePot != null ? action.sidePot : undefined,
  }
}

export const ActionProvider = props => {
  const alert = useAlert()
  const user = useContext<User>(UserContext)
  const [value, setValue] = useState<CContext>({
    big: undefined,
    button: undefined,
    communityCards: undefined,
    id: undefined,
    pot: undefined,
    round: undefined,
    turn: undefined,
    sidePot: undefined,
    setValue: async (key, value) => {
      const changed: any = {}
      switch (key) {
        case 'action': {
          Object.assign(changed, getProp(value))
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
            value.id == null &&
            user.group != null &&
            user.group.action != null
          ) {
            const action = await list.get(user.group.action, 'action')

            if (!action) return

            alert.info('force refreshed game')

            setValue(state => ({ ...state, ...getProp(action) }))
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
        if (value.id != null) {
          alert.info('game ended')
          setValue(state => ({ ...state, action: undefined }))
        }
        return
      }

      if (user.group.action == null) {
        if (value.id != null) {
          alert.info('game ended')
          setValue(state => ({ ...state, action: undefined }))
        }
        return
      }

      if (!value || value.id !== user.group.action) {
        const action = await list.get(user.group.action, 'action')

        if (!action) return

        setValue(state => ({ ...state, ...getProp(action) }))
      }
    }

    apply()
  }, [value, user.group])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
