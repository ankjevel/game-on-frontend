import React from 'react'

import './Alert.css'

import { IconX } from 'react-heroicons-ui'
import { AlertComponentPropsWithStyle } from 'react-alert'

const AlertTemplate = ({
  message,
  options: { type },
  style,
  close,
}: AlertComponentPropsWithStyle) => {
  return (
    <div className={`c_alert ${type}`} style={style} role="alert">
      <p className="message">{message}</p>
      <button className="close" onClick={close}>
        <IconX />
      </button>
    </div>
  )
}

export default AlertTemplate
