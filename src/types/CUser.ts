import { Group, User, JWS } from 'Api'
import { JWT } from 'JWT'

export type SetValue = 'token' | 'group' | 'jwt'

export interface ISetValue {
  setValue(key: 'group', value: Group): Promise<void>
  setValue(key: 'token', value: JWS): Promise<void>
  setValue(key: 'jwt', value: JWT): Promise<void>
}

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
}

export default CUser
