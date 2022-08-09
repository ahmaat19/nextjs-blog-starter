import mongoose from 'mongoose'

const storyScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
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

const Story = mongoose.models.Story || mongoose.model('Story', storyScheme)
export default Story
