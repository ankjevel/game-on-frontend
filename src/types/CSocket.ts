export type CSocket = {
  id: string
  room: string
  connected: boolean
  userSet: boolean
  userListen: boolean
  actionListen: boolean
}

export type OnMessage = (message: string) => void

export default CSocket
