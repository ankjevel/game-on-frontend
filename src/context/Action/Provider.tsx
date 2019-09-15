import CContext from './Types'
import React, { useEffect, useState } from 'react'
import Context from './context'

export const ActionProvider = props => {
  const [value, setValue] = useState<CContext>({})

  useEffect(() => {}, [])

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ActionProvider
