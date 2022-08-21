import Head from 'next/head'
import usePostsHook from '../../utils/api/posts'
import { Spinner, Message } from '../../components'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Post = () => {
  const router = useRouter()
  const { slug } = router.query

  const { getPostById } = usePostsHook({
    page: 1,
    q: '',
    id: slug,
  })

  const { data: post, isLoading, isError, error } = getPostById

  if (!post)
    return (
      <>
        <Head>
          <title>Posts Details</title>
          <meta property='og:title' content='Posts Details' key='title' />
        </Head>

        {isError && <Message variant='danger'>{error}</Message>}
      </>
    )

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta
          name='title'
          property='og:title'
          content={post?.title}
          key='title'
        />
        <meta
          name='description'
          property='og:description'
          content={post?.excerpt}
          key='description'
        />
      </Head>

      {isError && <Message variant='danger'>{error}</Message>}

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='container'>
          <div className='card-img-tops text-center'>
            <div
              className='position-relative'
              style={{
                height: '420px',
              }}
            >
              <Image
                src={post?.image}
                alt={post?.title}
                layout={'fill'}
                className='image'
                objectFit={'cover'}
              />
            </div>
          </div>
          <h1>{post?.title}</h1>
          <div
            className='card-text'
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      )}
    </>
  )
}

export default Post
