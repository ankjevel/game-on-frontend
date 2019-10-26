import { CUser } from 'CUser'
import { CAction } from 'CAction'

export type Params = {
  onClick?: () => void
  actionID: CAction['id']
  bigID: CAction['big']
  button: CAction['button']
  communityCards: CAction['communityCards']
  group: CUser['group']
  pot: CAction['pot']
  round: CAction['round']
  sidePot?: CAction['sidePot']
  turn: CAction['turn']
  userID: CUser['id']
  users: CUser['users']
  winners?: CAction['winners']
  lastMove?: CAction['lastMove']
}
