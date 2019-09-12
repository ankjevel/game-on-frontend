export interface Action {
  id: string
}

export interface User {
  id: string
  name: string
  email: string
}

export type Group = {
  id: string
  name: string
  startSum: number
  owner: User['id']
  users: {
    id: User['id']
    sum: number
  }[]
  blind: {
    small: number
    big: number
  }
  action?: Action['id']
}

export type NewGroup = {
  name: Group['name']
  startSum: MaybeUndefined<Group['startSum']>
  smallBlind: MaybeUndefined<Group['blind']['small']>
  bigBlind: MaybeUndefined<Group['blind']['big']>
}
