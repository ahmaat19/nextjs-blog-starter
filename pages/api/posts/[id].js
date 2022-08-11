import nc from 'next-connect'
import db from '../../../config/db'
import Category from '../../../models/Category'
import Post from '../../../models/Post'
import { isAuth } from '../../../utils/auth'

const schemaName = Post
const schemaNameString = 'Post'

const handler = nc()
handler.use(isAuth)
handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const post = await schemaName.findById(id).lean()

    res.status(200).send(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const { title, image, content, category, status } = req.body

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    const exist = await schemaName.findOne({
      title: { $regex: `^${req.body?.title?.trim()}$`, $options: 'i' },
      _id: { $ne: id },
    })

    if (exist)
      return res.status(400).json({ error: 'Duplicate value detected' })

    const categoryObj = await Category.findOne({
      category,
      status: 'active',
    })
    if (!categoryObj)
      return res.status(404).json({ error: 'Category is not active' })

    object.title = title
    object.image = image
    object.content = content
    object.category = category
    object.status = status
    object.updated = req.user.id
    await object.save()
    res.status(200).json({ message: `${schemaNameString} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.delete(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    await object.remove()
    res.status(200).json({ message: `${schemaNameString} removed` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
