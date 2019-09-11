import { Socket } from 'socket'
import { createContext } from 'react'

const SocketContext = createContext({
  room: '',
} as Socket)

export default SocketContext
