import { Socket } from 'Socket'
import { createContext } from 'react'

const SocketContext = createContext({
  room: '',
  id: '',
} as Socket)

export default SocketContext
