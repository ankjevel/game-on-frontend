import { NewGroup } from 'Api'
import React, { Component, ContextType, Fragment } from 'react'

import './CreateOrJoinGroup.css'

import UserContext from '../../context/User'
import * as api from '../../utils/api'
import Modal from '../Modal'
import SignOut from '../SignOut'

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
          .replace(/ {1,}/g, '-')
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
          <div className="create-or-join-group-modal">
            <h1>Input group id</h1>
            <form onSubmit={this.joinGroup}>
              <input
                className="join"
                name="join"
                onChange={this.handleChange}
              />
              {this.state.joinError && (
                <div className="error" role="alert">
                  <p>
                    <strong>Error</strong>
                  </p>
                  <p>{this.state.joinError}</p>
                </div>
              )}
            </form>
          </div>
        </Modal>

        <div className="create-or-join-group">
          <SignOut className="sign-out" />
          <div className={`sign-in ${this.state.error ? 'error' : ''}`}>
            <form onSubmit={this.createGroup}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  className="input-type"
                  type="name"
                  name="name"
                  required={true}
                  value={this.state.input.name}
                  onChange={this.handleChange}
                />
              </div>

              <div>
                <label htmlFor="startSum">Start sum</label>
                <input
                  className="input-type"
                  type="number"
                  name="startSum"
                  value={this.state.input.startSum}
                  onChange={this.handleChange}
                />
              </div>

              <div className="buttons">
                <div>
                  <div className="button">
                    <label htmlFor="smallBlind">Small blind</label>
                    <input
                      className="input-type"
                      type="number"
                      name="smallBlind"
                      value={this.state.input.smallBlind}
                      onChange={this.handleChange}
                    />
                  </div>

                  <div className="button">
                    <label htmlFor="bigBlind">Big blind</label>
                    <input
                      className="input-type"
                      type="number"
                      name="bigBlind"
                      value={this.state.input.bigBlind}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <input className="input-button" type="submit" value="Create" />
              </div>

              <div>
                <p>Or, if you have a groupID</p>
                <button
                  className="input-button"
                  type="button"
                  onClick={this.toggleModalVisible}
                >
                  Join group
                </button>
              </div>

              {this.state.error && (
                <div className="error" role="alert">
                  <p>
                    <strong>Error</strong>
                  </p>
                  <p>{this.state.error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default CreateOrJoinGroup
