import { Group } from 'Api'

export type CUser<T> = {
  id: string
  name: string
  ready: boolean
  token: string
  group?: Group
  setValue: T
}

export default CUser
