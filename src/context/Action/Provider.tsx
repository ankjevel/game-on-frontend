import CContext from 'CAction'
import React, { useEffect, useState, useContext } from 'react'
import UserContext, { Context as User } from '../User'
import Context from './context'

export const ActionProvider = props => {
  const user = useContext<User>(UserContext)
  const [value, setValue] = useState<MaybeNull<CContext>>(null)

  useEffect(() => {
    const apply = async () => {
      if (user.group == null) {
        return
      }

      if (user.group.action == null) {
        return setValue(null)
      }

      if (!value) {
        //
      }
    }

    apply()
  }, [value, user.group])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
