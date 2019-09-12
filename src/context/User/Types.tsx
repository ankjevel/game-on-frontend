import { CUser } from 'CUser'

export enum SetValue {
  Token = 'token',
  Group = 'group',
  JWT = 'jwt',
}

export type CContext = CUser<SetValue>

export default CContext
