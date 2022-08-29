import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ModalProps, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { DocumentData } from 'firebase/firestore'
import React from 'react'
import toast from 'react-hot-toast'
import CustomModal from '../../Globals/Components/CustomModal'
import { useFirestore } from '../../Globals/FirestoreContext'
import { showError } from '../../Globals/Utilities'

interface DeleteModalInterface extends ModalProps {
  loadingState: {
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  }
  record?: DocumentData | null
  setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteModal: React.FC<DeleteModalInterface> = ({
  loadingState: { loading, setLoading },
  setDeleteOpen,
  record,
  ...rest
}) => {
  const { deleteRecord } = useFirestore()

  const form = useForm({
    initialValues: {
      input: ''
    },

    initialErrors: {
      input: ''
    },

    validate: {
      input: (value) =>
        value.toLocaleLowerCase() === 'delete this record'
          ? null
          : 'Incorrect Input'
    },

    validateInputOnChange: true
  })

  return (
    <CustomModal
      {...rest}
      title={
        <div className="flex items-center gap-4 text-red-400">
          <FontAwesomeIcon icon={faTrashCan} />
          Delete Record
        </div>
      }
      classNames={{
        body: 'flex flex-col justify-between gap-8'
      }}
    >
      <div className="flex flex-col gap-4 py-4 text-gray-700">
        <Text>
          Doing so will permanently delete the data of this record Confirm your
          deletion of this record by typing:
        </Text>
        <span className="px-4 font-bold"> delete this record</span>
        <TextInput
          description="This is Case-Insensitive, spaces counts though."
          {...form.getInputProps('input')}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="default" onClick={() => setDeleteOpen(false)}>
          Cancel
        </Button>
        <Button
          color="red"
          loading={loading}
          disabled={Object.keys(form.errors).length !== 0}
          onClick={async () => {
            try {
              setLoading(true)
              await deleteRecord(record?.docId)
              toast.success('Record Successfully Deleted')
            } catch (error) {
              showError(error)
            } finally {
              setLoading(false)
            }
          }}
        >
          Delete
        </Button>
      </div>
    </CustomModal>
  )
}

export default DeleteModal
