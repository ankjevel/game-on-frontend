import CUser from 'CUser'
import { OnMessage } from 'CSocket'
import React, { useState, useEffect, memo, useRef } from 'react'

import './Chat.css'

export const Chat = memo(
  ({
    messages,
    onMessage,
    users,
    userID,
    className: cn,
  }: {
    className: string
    messages: CUser['messages']
    onMessage: OnMessage
    users: CUser['users']
    userID: CUser['id']
  }) => {
    const [message, setMessage] = useState('')

    const lastElement = useRef<HTMLDivElement>(null)

    useEffect(() => {
      scroll()
    }, [messages.length])

    const scroll = () => {
      if (lastElement.current == null) return
      lastElement.current.scrollIntoView({ behavior: 'smooth' })
    }

    const updateMessage = event => {
      event.preventDefault()

      const {
        target: { value },
      } = event

      setMessage(value.substr(0, 255))
    }

    const newMessage = event => {
      event.preventDefault()

      if (message.length <= 1) {
        return
      }

      onMessage(message)

      setMessage('')
    }

    const userName = (from: string) =>
      from === userID ? 'you' : users[from] || from

    return (
      <div className={`c_chat ${cn}`.trim()}>
        <div className="messages">
          <div className="wrap">
            {messages.map(([date, from, message], i) => {
              const prev = messages[i - 1]
              const next = messages[i + 1]
              const key = `message-${date}-${from}`
              const className = `message ${userID === from ? 'you ' : ''}${
                prev && prev[1] === from ? 'group ' : ''
              }${next && next[1] === from ? '' : 'last '}`.trim()

              return (
                <div
                  className={className}
                  key={key}
                  title={date}
                  ref={input => {
                    lastElement.current = input
                  }}
                >
                  <div className="info">
                    <div className="from">{userName(from)}</div>
                    <div className="date">
                      {date.split('T')[1].split('.')[0]}
                    </div>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={newMessage} className="form">
          <input
            className="input"
            value={message}
            onChange={updateMessage}
            onFocus={scroll}
            onClick={scroll}
            placeholder="Type a message..."
          />
        </form>
      </div>
    )
  }
)

export default Chat
