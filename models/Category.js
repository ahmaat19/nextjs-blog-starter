import mongoose from 'mongoose'
import User from './User'

const categoryScheme = mongoose.Schema(
  {
    name: { type: String, required: true },

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

const Category =
  mongoose.models.Category || mongoose.model('Category', categoryScheme)
export default Category
