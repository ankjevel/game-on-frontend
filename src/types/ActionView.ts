import { User } from 'Api'
import { UserSummary } from 'CAction'

export type Row = {
  name: string
  id: User['id']
  sum: number
  action: UserSummary
}
