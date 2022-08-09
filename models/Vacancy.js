import mongoose from 'mongoose'

const vacanciesScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    file: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },

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

const Vacancy =
  mongoose.models.Vacancy || mongoose.model('Vacancy', vacanciesScheme)
export default Vacancy
