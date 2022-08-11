import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { Spinner, Pagination, Message, Confirm } from '../components'
import { inputText, inputTextArea } from '../utils/dynamicForm'
import FormView from '../components/FormView'
import useMediasHook from '../utils/api/medias'
import useUploadHook from '../utils/api/upload'
import TableView from '../components/TableView'

const Medias = () => {
  const [page, setPage] = useState(1)
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)

  const { getMedias, postMedia, deleteMedia } = useMediasHook({
    page,
    q: '',
  })
  const { postUpload } = useUploadHook()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      auth: true,
    },
  })

  const { data, isLoading, isError, error, refetch } = getMedias

  const {
    data: dataUpload,
    isLoading: isLoadingUpload,
    isError: isErrorUpload,
    error: errorUpload,
    mutateAsync: mutateAsyncUpload,
    isSuccess: isSuccessUpload,
  } = postUpload

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteMedia

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postMedia

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      mutateAsyncUpload({ type: 'image', formData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (isSuccessPost) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const deleteHandler = (id) => {
    const url = id?.split('/')[id?.split('/').length - 1]
    console.log({ url })
    confirmAlert(Confirm(() => mutateAsyncDelete(`delete-this-image*${url}`)))
  }

  const name = 'Media Libraries List'
  const label = 'Media'
  const modal = 'media'

  // FormView
  const formCleanHandler = () => {
    reset()
  }

  // TableView
  const table = {
    header: ['Link'],
    body: ['url'],
    data: data,
  }

  const submitHandler = (data) => {
    mutateAsyncPost(data)
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      mutateAsyncUpload({ type: 'image', formData })
    }
  }

  const form = [
    inputText({
      register,
      errors,
      label: 'Name',
      name: 'name',
      placeholder: 'Enter name',
    }),
  ]

  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-md'

  return (
    <>
      <Head>
        <title>Media Libraries</title>
        <meta property='og:title' content='Media Libraries' key='title' />
      </Head>

      {isSuccessDelete && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {isSuccessPost && (
        <Message variant='success'>
          {label} has been Created successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <FormView
        edit={false}
        formCleanHandler={formCleanHandler}
        form={form}
        watch={watch}
        isLoadingUpdate={null}
        isLoadingPost={isLoadingPost}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        column={column}
        row={row}
        modalSize={modalSize}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <TableView
          table={table}
          editHandler={null}
          deleteHandler={deleteHandler}
          searchHandler={null}
          isLoadingDelete={isLoadingDelete}
          name={name}
          label={label}
          modal={modal}
          addBtn={true}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Medias)), {
  ssr: false,
})
