import React, { ReactNode } from 'react'

interface DescListInterface {
  label: string
  value: ReactNode
}

const DescList: React.FC<DescListInterface> = ({ label, value }) => {
  return (
    <dl className="flex gap-x-4">
      <dl className="min-w-[140px] xs:min-w-[200px]">{label}</dl>

      <dd className="font-bold text-gray-500">{value}</dd>
    </dl>
  )
}

export default DescList
