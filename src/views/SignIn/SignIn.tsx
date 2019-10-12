import { ISignIn, ICreate, State } from 'SignIn'

import React, { Component, ContextType } from 'react'

import './SignIn.css'

import UserContext from '@/context/User'
import * as api from '@/utils/api'
import InputError from '@/components/InputError'

class SignIn extends Component<{}, State> {
  static contextType = UserContext
  context!: ContextType<typeof UserContext>

  constructor(props) {
    super(props)

    this.state = {
      create: false,
      input: {
        password: '',
        passwordRepeat: '',
        name: '',
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleForgot = this.handleForgot.bind(this)
    this.toggleCreate = this.toggleCreate.bind(this)
  }

  simpleHandleJWS = (token?: string) => {
    if (token == null || typeof token !== 'string') {
      return false
    }

    const jwt = api.validate(token)
    if (!jwt) {
      return false
    }

    api.setToken(token)

    this.context.setValue('token', token)
    this.context.setValue('jwt', jwt)

    return true
  }

  signIn: ISignIn = async input =>
    this.simpleHandleJWS(await api.user.newToken(input))

  create: ICreate = async ({ name, password: p1, passwordRepeat: p2 }) =>
    this.simpleHandleJWS(await api.user.create({ name, p1, p2 }))

  handleChange(event) {
    event.persist()

    this.setState({
      ...this.state,
      input: {
        ...this.state.input,
        [event.target.name]: event.target.value.trim(),
      },
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    const {
      state: { input, create },
    } = this

    if (!input.password.trim()) {
      return
    }

    if (create) {
      if (
        !input.name ||
        !input.name.trim() ||
        !input.passwordRepeat ||
        !input.passwordRepeat.trim()
      ) {
        return this.setState({
          ...this.state,
          error: 'Missing required params',
        })
      }

      if (input.password !== input.passwordRepeat) {
        return this.setState({
          ...this.state,
          error: `Passwords don't match`,
        })
      }

      if (input.password.length < 8) {
        return this.setState({
          ...this.state,
          error: `Password too short (8 minimum)`,
        })
      }

      if (await this.create(input)) {
        return
      }

      return this.setState({
        ...this.state,
        error: 'Could not create user',
      })
    }

    if (
      await this.signIn({
        name: input.name,
        password: input.password,
      })
    ) {
      return
    }

    this.setState({
      ...this.state,
      error: 'Unable to sign in, try again',
    })
  }

  handleForgot(event) {
    event.preventDefault()

    alert('not implemented, yet')
  }

  toggleCreate(event) {
    event.preventDefault()

    this.setState({
      ...this.state,
      create: !this.state.create,
    })
  }

  render() {
    return (
      <div className="c_sign-in">
        <div className={`container ${this.state.error ? 'error' : ''}`}>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="name">Username</label>
              <input
                className="input-text"
                type="name"
                name="name"
                required={true}
                value={this.state.input.name}
                onChange={this.handleChange}
              />
            </div>

            <div>
              <label htmlFor="password">
                Password
                {this.state.create && <small> (minimum length: 8)</small>}
              </label>

              <input
                className="input-text"
                type="password"
                name="password"
                minLength={8}
                required={true}
                value={this.state.input.password}
                onChange={this.handleChange}
              />
            </div>

            {this.state.create && (
              <div>
                <label htmlFor="passwordRepeat">Repeat password</label>

                <input
                  className="input-text"
                  type="password"
                  minLength={8}
                  name="passwordRepeat"
                  required={true}
                  value={this.state.input.passwordRepeat}
                  onChange={this.handleChange}
                />
              </div>
            )}

            <div className="buttons">
              <div>
                <input
                  className="input button left"
                  type="submit"
                  value={this.state.create ? 'Create' : 'Login'}
                />
                <button
                  className="input button dim right"
                  type="button"
                  onClick={this.toggleCreate}
                >
                  {this.state.create ? 'Returning user?' : 'Create new?'}
                </button>
              </div>
            </div>

            <InputError message={this.state.error} />
          </form>
        </div>
      </div>
    )
  }
}

export default SignIn
