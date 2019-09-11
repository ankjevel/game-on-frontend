import { Config } from 'config'
import React, { createContext } from 'react'

const ConfigContext = createContext(null as MaybeNull<Config>)

export default ConfigContext
