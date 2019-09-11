import { User } from 'user'
import { createContext } from 'react'

const UserContext = createContext({
  id: '',
} as User)

export default UserContext
