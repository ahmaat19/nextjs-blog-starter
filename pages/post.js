import React, { useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'

const Post = () => {
  const [text, setText] = useState('')

  return <RichTextEditor text={text} setText={setText} height={400} />
}

export default Post
