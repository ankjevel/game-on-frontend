import React, { useContext } from 'react'

import userContext from '../../context/User'

export const Action = () => {
  const user = useContext(userContext)

  return (
    <div>
      <h1>Action</h1>
    </div>
  )
}

export default Action
