import { NewGroup } from 'Api'
import React, { Component, ContextType, Fragment } from 'react'
import UserContext from '../../context/User'
import * as api from '../../utils/api'
import Modal from '../Modal'
import { isObject } from 'util'

type Props = {}
type State = {
  error: string
  joinError: string
  input: NewGroup & { join: string }
  isOpen: boolean
}

class CreateOrJoinGroup extends Component<Props, State> {
  static contextType = UserContext
  context!: ContextType<typeof UserContext>

  constructor(props) {
    super(props)

    this.state = {
      error: '',
      joinError: '',
      input: {
        name: '',
        startSum: 200,
        smallBlind: 2,
        bigBlind: 4,
        join: '',
      },
      isOpen: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.createGroup = this.createGroup.bind(this)
    this.joinGroup = this.joinGroup.bind(this)
    this.toggleModalVisible = this.toggleModalVisible.bind(this)
  }

  handleChange(event) {
    event.preventDefault()

    const {
      target: { name, value: valuePre },
    } = event
    const { state } = this
    const { input } = state

    const isNumber = typeof input[name] === 'number'

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
      input: {
        ...input,
        [name]: value,
      },
    })
  }

  async joinGroup(event) {
    event.preventDefault()
    const {
      state: {
        input: { join },
      },
    } = this

    const match = join.match(/[\d\w]{8}(?:-[\w\d]{4}){3}-[\w\d]{12}/i)

    if (match == null) {
      this.setState({
        ...this.state,
        joinError: 'value does not look like a valid group id',
      })
      return
    }

    const res = await api.group.join(match[0])

    if (res == null) {
      return
    }

    this.context.setValue('group', res)
  }

  toggleModalVisible() {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
    })
  }

  async createGroup(event) {
    event.preventDefault()

    const {
      state: {
        input: { bigBlind, smallBlind, startSum, name },
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

    const res = await api.group.create({ bigBlind, smallBlind, startSum, name })

    if (!res) {
      const error = 'Could not create group'
      return this.setState({ ...this.state, error })
    }

    this.context.setValue('group', res)
  }

  render() {
    return (
      <Fragment>
        <Modal onClose={this.toggleModalVisible} isOpen={this.state.isOpen}>
          <div>
            <h1>Input group id</h1>
            <form onSubmit={this.joinGroup}>
              <input
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal outline-none"
                name="join"
                onChange={this.handleChange}
              />
              {this.state.joinError && (
                <div
                  className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                  role="alert"
                >
                  <p className="font-bold">Error</p>
                  <p>{this.state.joinError}</p>
                </div>
              )}
            </form>
          </div>
        </Modal>
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
                onClick={this.toggleModalVisible}
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
      </Fragment>
    )
  }
}

export default CreateOrJoinGroup
