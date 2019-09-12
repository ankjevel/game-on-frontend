import React, { Component } from 'react'
import UserContext from '../../context/User'

class CreateGroup extends Component<{}, {}> {
  static contextType = UserContext

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return <div>Join any group</div>
  }
}

export default CreateGroup
