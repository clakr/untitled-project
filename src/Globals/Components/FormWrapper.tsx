import React from 'react'

interface PropInterface {
  children: JSX.Element | JSX.Element[]
}

const FormWrapper: React.FC<PropInterface> = ({ children }) => {
  return (
    <div className="flex min-w-full flex-col justify-center gap-y-6 lg:min-w-[500px] lg:rounded-3xl lg:border lg:border-gray-50 lg:bg-white lg:p-6 lg:shadow-2xl lg:shadow-gray-300 xl:min-w-[600px] 2xl:min-w-[700px]">
      {children}
    </div>
  )
}

export default FormWrapper
