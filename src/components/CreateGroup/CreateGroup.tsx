import React, { Component, ContextType } from 'react'
import UserContext, { SetValue } from '../../context/User'
import { NewGroup } from 'Api'
import req from '../../utils/req'

type Props = {}
type State = {
  error: string
  input: NewGroup
}

class CreateGroup extends Component<Props, State> {
  static contextType = UserContext
  context!: ContextType<typeof UserContext>

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      input: {
        name: '',
        startSum: 200,
        smallBlind: 2,
        bigBlind: 4,
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    event.persist()
    const {
      target: { name, value: valuePre },
    } = event
    const { state } = this
    const { input } = state

    const isNumber = typeof input[name] === 'number'

    if (isNumber && isNaN(parseInt(valuePre, 10))) {
      return
    }

    const value = isNumber
      ? parseInt(valuePre, 10)
      : valuePre
          .trimLeft()
          .replace(/ {1,}$/, '-')
          .replace(/[^a-z0-9-åäö]/gi, '')
          .replace(/-{2,}/g, '-')
          .toLocaleLowerCase()

    switch (name) {
      case 'bigBlind': {
        if (value >= state.input.startSum || value <= state.input.smallBlind) {
          return
        }

        break
      }

      case 'startSum': {
        if (value <= state.input.bigBlind) {
          return
        }

        break
      }

      case 'smallBlind': {
        if (value >= state.input.bigBlind) {
          return
        }

        break
      }
    }

    this.setState({
      ...state,
      input: {
        ...input,
        [name]: value,
      },
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    const res = await req({
      url: '/group',
      method: 'POST',
      body: JSON.stringify(this.state.input),
    })

    if (!res) {
      const error = 'Could not create group'
      return this.setState({ ...this.state, error })
    }

    this.context.setValue(SetValue.Group, res)
  }

  render() {
    return (
      <div className="flex-1">
        <form
          onSubmit={this.handleSubmit}
          className={`${
            this.state.error ? 'bg-red-100' : 'bg-white'
          } create-group shadow-md rounded px-8 pt-6 pb-8 mb-4 border rounded w-full'`}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2 w-full"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="name"
              name="name"
              required={true}
              value={this.state.input.name}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="startSum"
              className="block text-gray-700 text-sm font-bold mb-2 w-full"
            >
              Start sum
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="startSum"
              value={this.state.input.startSum}
              onChange={this.handleChange}
            />
          </div>

          <div className="p-4">
            <div className="flex -mx-2">
              <div className="w-1/2">
                <label
                  htmlFor="smallBlind"
                  className="block text-gray-700 text-sm font-bold mb-2 w-full"
                >
                  Small blind
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  name="smallBlind"
                  value={this.state.input.smallBlind}
                  onChange={this.handleChange}
                />
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="bigBlind"
                  className="block text-gray-700 text-sm font-bold mb-2 w-full"
                >
                  Big blind
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  name="bigBlind"
                  value={this.state.input.bigBlind}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <input
              className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
              type="submit"
              value="Create"
            />
          </div>

          {this.state.error && (
            <div
              className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{this.state.error}</p>
            </div>
          )}
        </form>
      </div>
    )
  }
}

export default CreateGroup