import { User } from 'User'
import { createContext } from 'react'

const UserContext = createContext({
  id: '',
} as User)

export default UserContext
