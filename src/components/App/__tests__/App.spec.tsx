import Config from 'config'
import React, { createContext } from 'react'
import TestRenderer from 'react-test-renderer'

const config: Config = {
  debug: true,
  api: 'localhost:5555',
}

jest.mock('../../../context/Config', () => createContext(config))

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
