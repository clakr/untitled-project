import React from 'react'
import { Link } from 'react-router-dom'

interface PropInterface {
  to: string
  value: string
}

const LinkCustom: React.FC<PropInterface> = ({ to, value }) => {
  return (
    <Link
      to={to}
      className="rounded-lg px-3 py-1 text-blue-mantine6 transition-colors duration-300 hover:bg-blue-mantine6 hover:text-gray-50 focus:outline-offset-[-2px] focus:outline-blue-mantine6"
    >
      {value}
    </Link>
  )
}

export default LinkCustom
