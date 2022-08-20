import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import usePostsHook from '../utils/api/posts'
import useCategoriesHook from '../utils/api/categories'
import { Spinner, Pagination, Message, Confirm } from '../components'
import {
  dynamicInputSelect,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'
import TableView from '../components/TableView'
import FormView from '../components/FormView'
import RichTextEditor from '../components/RichTextEditor'

const Posts = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')
  const [text, setText] = useState('')

  const { getPosts, postPost, updatePost, deletePost } = usePostsHook({
    page,
    q,
  })
  const { getCategories } = useCategoriesHook({
    page: 1,
    limit: 1000000000,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: 'disabled',
    },
  })

  const { data, isLoading, isError, error, refetch } = getPosts
  const { data: categoriesData } = getCategories

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updatePost

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deletePost

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postPost

  useEffect(() => {
    if (isSuccessPost || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost, isSuccessUpdate])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Title', 'Category'],
    body: ['title', 'category.name'],
    createdAt: 'createdAt',
    status: 'Status',
    data: data,
  }

  const editHandler = (item) => {
    setEdit(true)
    setId(item._id)

    table.body.map((t) => setValue(t, item[t]))
    setValue('category', item?.category?._id)
    setValue('image', item?.image)
    setValue('status', item?.status)
    setText(item?.content)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Posts List'
  const label = 'Post'
  const modal = 'post'
  const searchPlaceholder = 'Search by title'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
    setText('')
  }

  const submitHandler = (data) => {
    edit
      ? mutateAsyncUpdate({
          _id: id,
          content: text,
          ...data,
        })
      : mutateAsyncPost({ ...data, content: text })
  }

  const form = [
    <div key={1} className='row'>
      <div className='col-lg-4 col-md-6 col-12'>
        {inputText({
          register,
          errors,
          label: 'Title',
          name: 'title',
          placeholder: 'Enter title',
        })}
      </div>
      <div className='col-lg-4 col-md-6 col-12'>
        {inputText({
          register,
          errors,
          label: 'Image',
          name: 'image',
          placeholder: 'Enter image url',
        })}
      </div>
      <div className='col-lg-4 col-md-6 col-12'>
        {dynamicInputSelect({
          register,
          errors,
          label: 'Category',
          name: 'category',
          placeholder: 'Select category',
          value: 'name',
          data: categoriesData?.data?.filter((c) => c.status === 'active'),
        })}
      </div>
      <div className='col-12'>
        <RichTextEditor text={text} setText={setText} height={400} />
      </div>
      <div className='col-lg-4 col-md-6 col-12'>
        {staticInputSelect({
          register,
          errors,
          label: 'Status',
          name: 'status',
          placeholder: 'Select status',
          data: [{ name: 'active' }, { name: 'disabled' }],
        })}
      </div>
    </div>,
  ]

  const row = false
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-xl'

  return (
    <>
      <Head>
        <title>Posts</title>
        <meta property='og:title' content='Posts' key='title' />
      </Head>

      {isSuccessDelete && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          {label} has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
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
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        watch={watch}
        isLoadingUpdate={isLoadingUpdate}
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
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          searchHandler={searchHandler}
          isLoadingDelete={isLoadingDelete}
          name={name}
          label={label}
          modal={modal}
          setQ={setQ}
          q={q}
          searchPlaceholder={searchPlaceholder}
          searchInput={true}
          addBtn={true}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Posts)), {
  ssr: false,
})
