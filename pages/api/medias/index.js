import nc from 'next-connect'
import path from 'path'
import fs from 'fs'
import { isAuth } from '../../../utils/auth'
export const config = { api: { bodyParser: false } }

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  try {
    const files = fs.readdirSync(path.join('public/uploads'))

    return res.status(200).json({
      total: files?.length,
      data: files?.map((file, index) => ({
        _id: index + 1,
        url: `/upload/${file}`,
      })),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
