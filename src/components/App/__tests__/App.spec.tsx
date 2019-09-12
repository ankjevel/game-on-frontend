import React, { createContext } from 'react'
import TestRenderer from 'react-test-renderer'

jest.mock('../../../context/Config', () =>
  createContext({
    api: 'configAPI',
  })
)
jest.mock('../../../context/Socket', () =>
  createContext({
    id: 'socketID',
    room: 'socketRoom',
  })
)
jest.mock('../../../context/User', () =>
  createContext({
    id: 'userID',
    group: {
      id: 'groupID',
    },
  })
)

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
      "api": "configAPI",
      "userID": "userID",
      "userGroup": "groupID",
      "socketID": "socketID",
      "socketRoom": "socketRoom"
    }
        </code>
      </div>
    </div>
  `)
})
