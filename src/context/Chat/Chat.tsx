import CChat from 'CChat'

import React, { useState } from 'react'

import Context from './context'

export const ChatProvider = props => {
  const [value, setValue] = useState<CChat>({
    messages: [],
    visible: false,
    updateVisibility: visible => setValue(state => ({ ...state, visible })),
    newMessage: content =>
      setValue(state => {
        const messages = state.messages.slice(state.messages.length - 50)
        messages.push([content.date, content.userID, content.message])

        return {
          ...state,
          messages,
        }
      }),
  })

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export default ChatProvider
