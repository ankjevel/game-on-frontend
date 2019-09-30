import { CUser } from 'CUser'
import { CAction } from 'CAction'

export type Params = {
  turn: CAction['turn']
  communityCards: CAction['communityCards']
  round: CAction['round']
  pot: CAction['pot']
  button: CAction['button']
  actionID: CAction['id']
  bigID: CAction['big']
  userID: CUser['id']
  group: CUser['group']
  users: CUser['users']
}
