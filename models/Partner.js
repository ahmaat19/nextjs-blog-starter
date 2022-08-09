import mongoose from 'mongoose'
import User from './User'

const partnerScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },

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

const Partner =
  mongoose.models.Partner || mongoose.model('Partner', partnerScheme)
export default Partner
