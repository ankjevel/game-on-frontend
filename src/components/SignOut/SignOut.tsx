import React, { SFC } from 'react'

import './SignOut.css'

import { IconUpload } from 'react-heroicons-ui'
import { Link, Prompt } from 'react-router-dom'

export const SignOut: SFC<{
  className?: string
}> = ({ className: cn }) => {
  const className = `c_sign-out ${cn}`.trim()

  return (
    <Link className={className} to="/sign-out" title="Sign out">
      <Prompt message="Are you sure you want to sign out?" />
      <IconUpload />
    </Link>
  )
}

export default SignOut
