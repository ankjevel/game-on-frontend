import React from 'react'
import TestRenderer from 'react-test-renderer'
import App from '../App'

test('it renders the component', async () => {
  const component = TestRenderer.create(<App />)

  const tree = component.toJSON()

  expect(tree).toMatchInlineSnapshot(`null`)
})
