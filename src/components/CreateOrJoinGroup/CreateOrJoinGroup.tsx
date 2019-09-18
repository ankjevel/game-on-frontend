import { NewGroup } from 'Api'
import React, { Component, ContextType } from 'react'
import UserContext from '../../context/User'
import * as api from '../../utils/api'

type Props = {}
type State = {
  error: string
  create: NewGroup
}

class CreateOrJoinGroup extends Component<Props, State> {
  static contextType = UserContext
  context!: ContextType<typeof UserContext>

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      create: {
        name: '',
        startSum: 200,
        smallBlind: 2,
        bigBlind: 4,
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.createGroup = this.createGroup.bind(this)
    this.joinGroup = this.joinGroup.bind(this)
  }

  handleChange(event) {
    event.preventDefault()

    const {
      target: { name, value: valuePre },
    } = event
    const { state } = this
    const { create } = state

    const isNumber = typeof create[name] === 'number'

    const value = isNumber
      ? isNaN(parseInt(valuePre, 10))
        ? 0
        : parseInt(valuePre, 10)
      : valuePre
          .trimLeft()
          .replace(/ {1,}$/, '-')
          .replace(/[^a-z0-9-åäö]/gi, '')
          .replace(/-{2,}/g, '-')
          .toLocaleLowerCase()

    this.setState({
      ...state,
      create: {
        ...create,
        [name]: value,
      },
    })
  }

  async joinGroup(event) {
    event.preventDefault()

    const id = window.prompt('input group id')

    if (
      id.trim() &&
      id.includes(':') &&
      id.split(':').length === 2 &&
      id.trim().match(/[^a-z0-9-:]/) != null
    ) {
      return
    }

    const res = await api.group.join(id.trim())

    if (res == null) {
      return
    }

    this.context.setValue('group', res)
  }

  async createGroup(event) {
    event.preventDefault()

    const {
      state: {
        create: { bigBlind, smallBlind, startSum },
      },
    } = this

    if (bigBlind >= startSum || bigBlind <= smallBlind) {
      return window.alert(
        'big blind needs to be lower than start sum and higher than small blind'
      )
    }

    if (startSum <= bigBlind) {
      return window.alert('start sum needs to be higher than the big blind')
    }

    if (smallBlind >= bigBlind) {
      return window.alert('smal blind needs to be lower than big blind')
    }

    if (smallBlind < 1) {
      return window.alert('small blind needs to b greater than 1')
    }

    const res = await api.group.create(this.state.create)

    if (!res) {
      const error = 'Could not create group'
      return this.setState({ ...this.state, error })
    }

    this.context.setValue('group', res)
  }

  render() {
    return (
      <div
        className={`${
          this.state.error ? 'bg-red-100' : 'bg-white'
        } flex-1 sign-in '`}
      >
        <form
          onSubmit={this.createGroup}
          className="px-8 pt-6 pb-8 mb-4 w-full"
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
              value={this.state.create.name}
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
              value={this.state.create.startSum}
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
                  value={this.state.create.smallBlind}
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
                  value={this.state.create.bigBlind}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <input
              className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              value="Create"
            />
          </div>

          <div className="py-2">
            <p>Or, if you have a groupID</p>
            <button
              className="w-1/2 bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.joinGroup}
            >
              Join group
            </button>
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

export default CreateOrJoinGroup
