import React, { SFC, Fragment } from 'react'

import './InputError.css'

export const InputError: SFC<{
  message: string
  title?: string
  className?: string
}> = ({ title = 'Error', message, className: cn = '' }) => {
  const className = `c_input-error ${cn}`.trim()
  return message ? (
    <div className={className} role="alert">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{message}</p>
    </div>
  ) : (
    <Fragment />
  )
}

export default InputError
