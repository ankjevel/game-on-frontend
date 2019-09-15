import { ISignIn, ICreate, State } from 'SignIn'
import React, { Component, ContextType } from 'react'
import UserContext, { SetValue } from '../../context/User'
import * as api from '../../utils/api'

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

    this.context.setValue(SetValue.Token, token)
    this.context.setValue(SetValue.JWT, jwt)

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
      <div
        className={`${
          this.state.error ? 'bg-red-100' : 'bg-white'
        } flex-1 sign-in '`}
      >
        <form
          className="px-8 pt-6 pb-8 mb-4 w-full"
          onSubmit={this.handleSubmit}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2 w-full"
            >
              Username
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
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password {this.state.create && '(minimum length: 8)'}
            </label>

            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
              <label
                htmlFor="passwordRepeat"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Repeat password
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                minLength={8}
                name="passwordRepeat"
                required={true}
                value={this.state.input.passwordRepeat}
                onChange={this.handleChange}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex -mx-2">
              <input
                className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
                type="submit"
                value={this.state.create ? 'Create' : 'Login'}
              />
              <button
                className="w-1/2 bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                type="button"
                onClick={this.toggleCreate}
              >
                {this.state.create ? 'Returning user?' : 'Create new?'}
              </button>
            </div>
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

        {/* <div className="absolute ml-2">
          <button
            onClick={this.handleForgot}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-bl rounded-br"
          >
            Forgot Password?
          </button>
        </div> */}
      </div>
    )
  }
}

export default SignIn
