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
      className="app flex items-center justify-center"
    >
      <div
        className="self-center auto w-1/2 rounded overflow-hidden shadow-lg bg-white"
      >
        <div
          className="px-4 py-6"
        >
          <div>
            <p>
              id: 
              userID
            </p>
            <p>
              name: 
            </p>
            <p>
              group: 
            </p>
            <p>
              group id: 
              groupID
            </p>
            <p>
              socket: 
              socketID
            </p>
          </div>
          <div
            className="pt-4"
          >
            <button
              className="leave-button bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={[Function]}
            >
              Leave group
            </button>
          </div>
        </div>
      </div>
    </div>
  `)
})
