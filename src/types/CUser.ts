import { Group, User } from 'Api'

export type CUser<T> = {
  id: string
  name: string
  ready: boolean
  token: string
  group?: Group
  users: {
    [id: string]: User['name']
  }
  setValue: T
}

export default CUser
