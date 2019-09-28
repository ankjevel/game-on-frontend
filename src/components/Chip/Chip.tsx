import React, { SFC } from 'react'

import SVG from 'react-inlinesvg'

export const Chip: SFC<{
  className?: string
}> = ({ className }) => (
  <SVG className={className} src={require('../../svg/chip.svg')} />
)

export default Chip
