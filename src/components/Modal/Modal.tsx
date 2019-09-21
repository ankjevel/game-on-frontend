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
    <ReactModal
      className="modal absolute self-center auto flex items-center justify-center overflow-hidden outline-none h-full w-full bg-transparent"
      isOpen={props.isOpen}
    >
      <IconX
        className="cursor-pointer animated fadeIn absolute center bottom-0 z-10 mb-10 w-10 h-10 bg-white rounded-full"
        onClick={props.onClose}
      />

      <div
        onClick={closeOnClick && props.onClose}
        className={`absolute z-0 left-0 top-o bottom-0 right-0 overflow-hidden h-full w-full bg-blue-100 opacity-50 ${
          closeOnClick ? 'cursor-pointer' : ''
        }`}
      />
      <div className="relative animated zoomInLeft z-1 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">{props.children}</div>
      </div>
    </ReactModal>
  )
}

export default Modal
