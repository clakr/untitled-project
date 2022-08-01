import React from 'react'
import { Link } from 'react-router-dom'

interface PropInterface {
  to: string
  hover: string
  focus: string
  padding: string
  value: string
}

const LinkCustom: React.FC<PropInterface> = ({
  to,
  hover,
  focus,
  padding,
  value
}) => {
  return (
    <Link
      to={to}
      className={`rounded-lg text-blue-600 transition-colors duration-300 ${hover} ${focus} ${padding}`}
    >
      {value}
    </Link>
  )
}

export default LinkCustom
