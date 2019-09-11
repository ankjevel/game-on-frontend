import Config from 'CConfig'
import React, { createContext } from 'react'
import TestRenderer from 'react-test-renderer'

const config: Config = {
  api: 'localhost:5555',
}

jest.mock('../../../context/Config', () => createContext(config))
jest.mock('../../../context/Socket', () => createContext({}))
jest.mock('../../../context/User', () => createContext({}))

import App from '../App'

test('it renders the component', async () => {
  const component = TestRenderer.create(<App />)

  expect(component.toJSON()).toMatchInlineSnapshot(`
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
      "api": "localhost:5555"
    }
        </code>
      </div>
    </div>
  `)
})
