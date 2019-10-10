import React, { SFC } from 'react'

import './SignOut.css'

import { IconUpload } from 'react-heroicons-ui'
import { Link } from 'react-router-dom'

export const SignOut: SFC<{
  className?: string
}> = ({ className: cn }) => {
  const className = `c_sign-out ${cn}`.trim()

  return (
    <Link className={className} to="/sign-out" title="Sign out">
      <IconUpload />
    </Link>
  )
}

export default SignOut
