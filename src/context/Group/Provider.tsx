import { CGroup } from 'CGroup'
import React, { useState, useContext, useEffect } from 'react'
import Context from './context'
import UserContext from '../User'

export const GroupProvider = props => {
  const user = useContext(UserContext)
  const [value, setValue] = useState<CGroup>({
    group: {
      id: '',
      name: '',
      startSum: 0,
      owner: '',
      users: [],
      blind: {
        small: 2,
        big: 4,
      },
      action: null,
    },
    setGroup: group => {
      console.log(group)
    },
  })

  useEffect(() => {
    const group = localStorage.getItem('group')
    if (!group) {
      return setValue(state => ({ ...state }))
    }
    console.log('handle group')
  }, [])

  useEffect(() => {
    if (user.group === '' && value.group.id !== '') {
      console.log('handle NO GROUp')
    }
  }, [user.group, value.group.id])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default GroupProvider
