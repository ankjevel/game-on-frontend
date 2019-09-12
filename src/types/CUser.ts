import { Group } from 'Api'

export type CUser<T> = {
  id: string
  token: string
  group?: Group
  ready: boolean
  setValue: (key: T, value: any) => void
}

export default CUser
