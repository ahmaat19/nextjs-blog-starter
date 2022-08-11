import mongoose from 'mongoose'
import User from './User'
import Category from './Category'

const postScheme = mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },

    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    created: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    updated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
)

const Post = mongoose.models.Post || mongoose.model('Post', postScheme)
export default Post
