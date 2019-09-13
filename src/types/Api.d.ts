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

  newToken: (input: {
    name: User['name']
    email: User['email']
  }) => Response<JWS>

  validToken: (token: JWS) => Response<{ status: 'ok' }>

  group: () => Response<Group>
}

export interface GroupRoutes {
  create: (body: NewGroup) => Response<Group>

  join: (id: Group['id']) => Response<Group>

  leave: (id: Group['id']) => Response<{ status: string }>
}
