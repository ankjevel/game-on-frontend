import React, { Component } from 'react'
import { User } from 'user'

class SignIn extends Component<
  {
    onSuccess: (id: User['id']) => void
  },
  {
    email: string
    password: string
  }
> {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    event.persist()

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.props.onSuccess(
      `submitted: ${this.state.email} ${this.state.password}`
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          email:
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>

        <label>
          password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>

        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default SignIn
