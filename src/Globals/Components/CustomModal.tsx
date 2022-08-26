import React from 'react'
import { Modal, ModalProps } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

type CustomModalInterface = ModalProps

const CustomModal: React.FC<CustomModalInterface> = ({ children, ...rest }) => {
  const isXS = useMediaQuery('(min-width: 450px)')

  return (
    <Modal
      overlayColor="gray"
      overlayOpacity={0.55}
      overlayBlur={3}
      size={isXS ? 440 : 300}
      classNames={{ modal: '!ml-0' }}
      {...rest}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
