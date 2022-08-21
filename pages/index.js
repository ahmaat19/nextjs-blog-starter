import { useState, useEffect } from 'react'
import Head from 'next/head'
import usePostsHook from '../utils/api/posts'
import { Spinner, Pagination, Message, Search } from '../components'
import Posts from '../components/Posts'

const Home = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const { getPosts } = usePostsHook({
    page,
    q,
  })

  const { data, isLoading, isError, error, refetch } = getPosts

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
    data: data,
  }

  return (
    <>
      <Head>
        <title>Posts</title>
        <meta property='og:title' content='Posts' key='title' />
      </Head>

      {isError && <Message variant='danger'>{error}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <div className='d-flex align-items-center flex-column mb-3'>
        <div className='col-auto'>
          <Search
            placeholder='Search by title'
            setQ={setQ}
            q={q}
            searchHandler={searchHandler}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Posts
          posts={table?.data?.data?.filter((p) => p?.status === 'active')}
        />
      )}
    </>
  )
}

export default Home
