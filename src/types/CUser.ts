import JWT from 'JWT'

export type CUser = {
  id: string
  token: string
  group: string
  ready: boolean
  setToken: (token: string) => void
  setJWT: (jwt: JWT) => void
  setGroup: (group: string) => void
}

export default CUser
