import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import { Spinner, Message, Confirm } from '../components'
import { inputFile, staticInputSelect } from '../utils/dynamicForm'
import FormView from '../components/FormView'
import useMediasHook from '../utils/api/medias'
import copy from 'copy-to-clipboard'
import { FaClipboard, FaDownload, FaFileAlt, FaTrash } from 'react-icons/fa'

const Medias = () => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState(null)
  const [clipBoard, setClipBoard] = useState('')

  const { getMedias, postMedia, deleteMedia } = useMediasHook({
    page: 1,
    q: '',
  })

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
    if (isSuccessPost) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost])

  const deleteHandler = (id) => {
    const url = id?.split('/')[id?.split('/').length - 1]
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
      mutateAsyncPost({ type: data?.type, formData })
    }
  }

  const form = [
    staticInputSelect({
      register,
      errors,
      label: 'File Type',
      name: 'type',
      placeholder: 'Select file typo',
      data: [{ name: 'file' }, { name: 'image' }],
    }),
    inputFile({
      register,
      errors,
      label: 'Upload Media',
      name: 'file',
      placeholder: 'Select file',
      setFile,
    }),
  ]

  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-md'

  const copyToClipboard = (url) => {
    copy(url)
    setClipBoard(url)

    setMessage('Copied to clipboard')
  }

  useEffect(() => {
    setTimeout(() => {
      setMessage('')
    }, 1500)
  }, [message])

  return (
    <>
      <Head>
        <title>Media Libraries</title>
        <meta property='og:title' content='Media Libraries' key='title' />
      </Head>

      {message && <Message variant='success'>{message}</Message>}

      {isSuccessDelete && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {isSuccessPost && (
        <Message variant='success'>
          {label} has been uploaded successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

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
        <div className='table-responsive bg-light p-3 mt-2'>
          <div className='d-flex align-items-center flex-column mb-2'>
            <h3 className='fw-light text-muted'>
              {name}
              <sup className='fs-6'> [{table.data && table.data.total}] </sup>
            </h3>

            <button
              className='btn btn-outline-primary btn-sm shadow my-2'
              data-bs-toggle='modal'
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
          </div>
          <div className='row'>
            {data?.data?.map((media) => (
              <div key={media?._id} className='col-lg-3 col-md-4 col-6'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body'>
                    <FaFileAlt
                      className='card-img-top mb-2 text-secondary'
                      style={{ fontSize: '15rem' }}
                    />
                    <div className='d-flex justify-content-between'>
                      <a
                        href={media?.url}
                        target='_blank'
                        rel='noreferrer'
                        className='btn btn-primary btn-sm text-start'
                      >
                        <FaDownload className='mb-1' />
                      </a>
                      <button
                        onClick={() => copyToClipboard(media?.url)}
                        className={`btn ${
                          clipBoard === media?.url
                            ? 'btn-success'
                            : 'btn-primary'
                        }  btn-sm text-start`}
                      >
                        <FaClipboard className='mb-1' />{' '}
                        {clipBoard === media?.url ? 'Copied' : 'Copy'}
                      </button>
                      {deleteHandler && (
                        <button
                          className='btn btn-danger btn-sm text-start'
                          onClick={() => deleteHandler(media?.url)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              <FaTrash className='mb-1' />
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                    <button className='btn btn-outline-primary btn-sm w-100 text-start my-2'>
                      <small>{media?.url?.split('/')[2]}</small>
                    </button>{' '}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Medias)), {
  ssr: false,
})
