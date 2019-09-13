import { CUser } from 'CUser'
import { Group, JWS } from 'Api'
import { JWT } from 'JWT'

export enum SetValue {
  Token = 'token',
  Group = 'group',
  JWT = 'jwt',
}

export interface ICContext {
  setValue(key: SetValue.Group, value: Group): Promise<void>
  setValue(key: SetValue.Token, value: JWS): Promise<void>
  setValue(key: SetValue.JWT, value: JWT): Promise<void>
}

export type CContext = CUser<ICContext['setValue']>

export default CContext
