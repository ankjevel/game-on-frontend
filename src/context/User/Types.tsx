import { CUser } from 'CUser'

export enum SetValue {
  Token = 'token',
  ID = 'id',
  Group = 'group',
  JWT = 'jwt',
}

export type CContext = CUser<SetValue>

export default CContext
