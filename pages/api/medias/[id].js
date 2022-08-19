import nc from 'next-connect'
import fs from 'fs'
import { isAuth } from '../../../utils/auth'
export const config = { api: { bodyParser: false } }

const handler = nc()

handler.use(isAuth)
handler.delete(async (req, res) => {
  try {
    const { id } = req.query
    const file = id?.split('*')[1]

    fs.unlink(`public/uploads/${file}`, (error) => {
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ media: file })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
