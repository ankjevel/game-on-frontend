import { Config } from 'Config'
import { createContext } from 'react'

const ConfigContext = createContext(null as MaybeNull<Config>)

export default ConfigContext
