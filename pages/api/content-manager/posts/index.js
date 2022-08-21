import nc from 'next-connect'
import db from '../../../../config/db'
import Post from '../../../../models/Post'
import Category from '../../../../models/Category'
import { isAuth } from '../../../../utils/auth'

const schemaName = Post

const handler = nc()
handler.get(async (req, res) => {
  await db()
  try {
    const q = req.query && req.query.q

    let query = schemaName.find(
      q ? { title: { $regex: q, $options: 'i' } } : {}
    )

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments(
      q ? { title: { $regex: q, $options: 'i' } } : {}
    )

    const pages = Math.ceil(total / pageSize)

    query = query
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .populate('category', ['name'])

    const result = await query

    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.use(isAuth)
handler.post(async (req, res) => {
  await db()
  try {
    const { title, image, category, content, excerpt, status, publishedAt } =
      req.body

    const exist = await schemaName.findOne({
      title: { $regex: `^${req.body?.title?.trim()}$`, $options: 'i' },
    })

    if (exist)
      return res.status(400).json({ error: 'Duplicate value detected' })

    const categoryObj = await Category.findOne({
      category: req.body?.category,
      status: 'active',
    })
    if (!categoryObj)
      return res.status(404).json({ error: 'Category is not active' })

    const slug = title?.trim()?.replaceAll(' ', '-')?.toLowerCase()

    const object = await schemaName.create({
      title,
      image,
      category,
      content,
      excerpt,
      status,
      slug,
      publishedAt,
      created: req.user.id,
    })
    res.status(200).send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
