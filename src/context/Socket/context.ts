import { Socket } from 'socket'
import { createContext } from 'react'

const SocketContext = createContext({
  room: '',
  id: '',
} as Socket)

export default SocketContext
