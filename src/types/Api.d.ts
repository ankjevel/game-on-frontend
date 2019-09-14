import { CConfig } from './CConfig'

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

export type NewGroupUpdate = {
  owner: Group['owner']
  name: Group['name']
  startSum: Group['startSum']
  smallBlind: Group['blind']['small']
  bigBlind: Group['blind']['big']
}

export type NewGroupOrder = { [key: number]: User['id'] }

export type Response<T> = Promise<MaybeNull<T>>

export type JWS = string

export interface ConfigRoutes {
  get: () => Response<CConfig>
}

export interface UserRoutes {
  create: (input: {
    name: User['name']
    email: User['email']
    p1: string
    p2: string
  }) => Response<JWS>

  newToken: (input: { email: User['email']; password: string }) => Response<JWS>

  validToken: (token: JWS) => Response<{ status: 'ok' }>

  group: () => Response<Group>
}

export interface GroupRoutes {
  create: (body: NewGroup) => Response<Group>

  join: (id: Group['id']) => Response<Group>

  leave: (id: Group['id']) => Response<{ status: string }>

  update: (id: Group['id'], body: Partial<NewGroupUpdate>) => Response<Group>

  order: (id: Group['id'], body: NewGroupOrder) => Response<Group>

  start: (id: Group['id']) => Response<Group>
}
