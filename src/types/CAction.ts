import { Group, User } from 'Api'

export type ActionType =
  | 'none'
  | 'bet'
  | 'check'
  | 'call'
  | 'raise'
  | 'allIn'
  | 'fold'
  | 'draw'
  | 'winner'
  | 'back'
  | 'bank'
  | 'join'
  | 'leave'
  | 'sittingOut'

export type UserSummary = {
  bet: number
  status: ActionType
}

export type NewAction = {
  type: ActionType
  value?: number
  order?: User['id'][][]
}

export interface KeyValue<T> {
  [key: string]: T
}

export interface IAction<T, Y> {
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

export type Action = IAction<NewAction, UserSummary>

export interface CActionSetValue {
  (key: 'action', value: Action): Promise<void>
}

export interface CActionRefresh {
  (key: 'action'): Promise<void>
}

export type CAction = {
  action?: Action
  setValue: CActionSetValue
  refresh: CActionRefresh
}

export default CAction
