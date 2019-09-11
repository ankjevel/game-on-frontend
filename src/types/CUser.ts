import JWT from 'JWT'

export type CUser = {
  id: string
  token: string
  ready: boolean
  setToken: (token: string) => void
  setJWT: (jwt: JWT) => void
}

export default CUser
