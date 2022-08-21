import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Posts = ({ posts }) => {
  console.log(posts)
  return (
    <div className='row'>
      {posts?.map((post) => (
        <div key={post?._id} className='col-lg-4 col-md-6 col-12'>
          <Link href={`/posts/${post?.slug}`}>
            <a className='text-decoration-none text-dark'>
              <div className='card border-0'>
                <div
                  className='position-relative'
                  style={{
                    height: '210px',
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

                <div className='card-body'>
                  <h5 className='card-title'>{post?.title}</h5>
                  <div
                    className='card-text'
                    dangerouslySetInnerHTML={{ __html: post?.excerpt }}
                  />
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Posts
