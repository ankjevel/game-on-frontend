import React, { SFC } from 'react'

import './Modal.css'

import ReactModal from 'react-modal'
import { IconX } from 'react-heroicons-ui'

export const Modal: SFC<{
  isOpen: boolean
  shouldCloseOnOverlayClick?: boolean
  onClose: () => void
}> = props => {
  const closeOnClick = props.shouldCloseOnOverlayClick
  return (
    <ReactModal className="c_modal" isOpen={props.isOpen}>
      <IconX className="icon" onClick={props.onClose} />

      <div
        onClick={closeOnClick && props.onClose}
        className={`bg ${closeOnClick ? 'close-on-click' : ''}`}
      />

      <div className="container">
        <div className="content">{props.children}</div>
      </div>
    </ReactModal>
  )
}

export default Modal
