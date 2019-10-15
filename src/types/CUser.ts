import { Group, User, JWS } from 'Api'
import { JWT } from 'JWT'

export type SetValue = 'token' | 'group' | 'jwt' | 'reset'

export interface ISetValue {
  setValue(key: 'group', value: Group): Promise<void>
  setValue(key: 'token', value: JWS): Promise<void>
  setValue(key: 'jwt', value: JWT): Promise<void>
  setValue(key: 'reset', value: any): Promise<void>
}

type MessageDate = string
type MessageFrom = User['id']
type MessageContent = string
type Message = [MessageDate, MessageFrom, MessageContent]

export type CUser = {
  id: string
  name: string
  ready: boolean
  token: string
  group?: Group
  users: {
    [id: string]: User['name']
  }
  setValue: ISetValue['setValue']
  newMessage: (message: {
    message: MessageContent
    userID: MessageFrom
    date: MessageDate
  }) => void
  messages: Message[]
}

export default CUser
