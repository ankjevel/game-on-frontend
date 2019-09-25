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
  cards?: [string, string]
}

export type NewAction = {
  type: ActionType
  value?: number
  order?: User['id'][][]
}

export interface KeyValue<T> {
  [key: string]: T
}

export type Deck = Tuple<MaybeNull<string>, 52>

export interface IAction<T, Y> {
  big: User['id']
  button: User['id']
  communityCards: string[]
  deck: Deck
  groupID: Group['id']
  id: string
  pot: number
  queued: KeyValue<T>
  round: 0 | 1 | 2 | 3 | 4
  sidePot?: { id: User['id']; sum: number }[]
  sittingOut?: User['id'][]
  small: User['id']
  turn: KeyValue<Y>
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
