import { Group, User, JWS } from 'Api'
import { JWT } from 'JWT'

export enum SetValue {
  Token = 'token',
  Group = 'group',
  JWT = 'jwt',
}

export interface ISetValue {
  setValue(key: SetValue.Group, value: Group): Promise<void>
  setValue(key: SetValue.Token, value: JWS): Promise<void>
  setValue(key: SetValue.JWT, value: JWT): Promise<void>
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
