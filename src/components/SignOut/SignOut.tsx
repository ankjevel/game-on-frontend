import React, { SFC } from 'react'

import './SignOut.css'

import { IconUpload } from 'react-heroicons-ui'
import { Link } from 'react-router-dom'

export const SignOut: SFC<{
  className?: string
}> = ({ className: cn = '' }) => (
  <Link className={`c_sign-out ${cn}`.trim()} to="/sign-out" title="Sign out">
    <IconUpload />
  </Link>
)

export default SignOut
