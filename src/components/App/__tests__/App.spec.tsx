import Config from 'config'
import React, { createContext } from 'react'
import TestRenderer from 'react-test-renderer'

const ConfigContext = createContext({
  debug: true,
  api: 'localhost:5555',
} as Config)

jest.mock('../../../context/Config', () => ConfigContext)

import App from '../App'

test('it renders the component', async () => {
  const component = TestRenderer.create(<App />)

  const tree = component.toJSON()

  expect(tree).toMatchInlineSnapshot(`
    <div
      className="app"
    >
      <div
        className="flex mb-4"
      >
        <code
          className="app-title"
        >
          {
      "debug": true,
      "api": "localhost:5555"
    }
        </code>
      </div>
    </div>
  `)
})
