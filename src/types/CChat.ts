import { User } from 'Api'

type MessageDate = string
type MessageFrom = User['id']
type MessageContent = string
type Message = [MessageDate, MessageFrom, MessageContent]

export type CChat = {
  messages: Message[]
  newMessage: (message: {
    message: MessageContent
    userID: MessageFrom
    date: MessageDate
  }) => void
  visible: boolean
  updateVisibility: (visible: boolean) => void
}

export default CChat
