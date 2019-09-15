import { Group, User } from 'Api'

export enum NewActionEnum {
  None = 'none',
  Bet = 'bet',
  Check = 'check',
  Call = 'call',
  Raise = 'raise',
  AllIn = 'allIn',
  Fold = 'fold',

  Draw = 'draw',
  Winner = 'winner',
  Back = 'back',
  Bank = 'bank',
  Join = 'join',
  Leave = 'leave',
  SittingOut = 'sittingOut',
}

export type UserSummary = {
  bet: number
  status: NewActionEnum
}

export type NewAction = {
  type: NewActionEnum
  value?: number
  winners?: User['id'][]
}

export interface KeyValue<T> {
  [key: string]: T
}

export interface ICAction<T, Y> {
  id: string
  round: 0 | 1 | 2 | 3 | 4
  groupID: Group['id']
  queued: KeyValue<T>
  turn: KeyValue<Y>
  button: User['id']
  big: User['id']
  small: User['id']
  pot: number
  sittingOut?: User['id'][]
  sidePot?: { id: User['id']; sum: number }[]
}

export type CAction = ICAction<NewAction, UserSummary>

export default CAction
