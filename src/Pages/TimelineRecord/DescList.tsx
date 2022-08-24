import React, { ReactNode } from 'react'

interface DescListInterface {
  label: string
  value: ReactNode
}

const DescList: React.FC<DescListInterface> = ({ label, value }) => {
  return (
    <dl className="flex gap-x-2">
      <dl className="min-w-[140px] xs:min-w-[200px]">{label}</dl>

      <dd className="whitespace-nowrap font-bold text-gray-500">
        {value ?? 'N/A'}
      </dd>
    </dl>
  )
}

export default DescList
