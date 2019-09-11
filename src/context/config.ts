import { Config } from 'config'
import { createContext } from 'react'

const ConfigContext = createContext(null as MaybeNull<Config>)

export default ConfigContext
