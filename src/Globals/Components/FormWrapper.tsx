import React from 'react'

interface PropInterface {
  children: JSX.Element | JSX.Element[]
}

const FormWrapper: React.FC<PropInterface> = ({ children }) => {
  return (
    <div className="lg:min-w-[500px] lg:rounded-3xl lg:border lg:border-gray-50 lg:bg-white lg:p-6 lg:shadow-2xl lg:shadow-gray-300 flex min-w-full flex-col justify-center gap-y-8">
      {children}
    </div>
  )
}

export default FormWrapper
