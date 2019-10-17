import React, { SFC } from 'react'

import SVG from 'react-inlinesvg'

import './Chip.css'

export const Chip: SFC<{
  className?: string
  type?: '' | 'dollar' | 'plus' | 'thin'
}> = ({ className, type }) => (
  <SVG
    className={`${className} svg-${type}`.trim()}
    src={require(`@/svg/chip${type ? `-${type}` : ''}.svg`)}
  />
)

export default Chip
