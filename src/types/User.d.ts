import JWT from 'JWT'

export type User = {
  id: string
  token: string
  setToken: (token: string) => void
  setJWT: (jwt: JWT) => void
}

export default User
