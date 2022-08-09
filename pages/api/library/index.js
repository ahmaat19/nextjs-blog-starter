import nc from 'next-connect'
import path from 'path'
import fs from 'fs'
import { fileTypeFromFile } from 'file-type'

import fileUpload from 'express-fileupload'
import { isAuth } from '../../../utils/auth'
export const config = { api: { bodyParser: false } }
const __dirname = path.resolve()

const handler = nc()
// handler.use(isAuth)
handler.use(fileUpload())

handler.get(async (req, res) => {
  try {
    // read files from public/uploads
    const files = fs.readdirSync(path.join('public/uploads'))

    // const posts = files.map((filename) => {
    //   const slug = filename.replace('.mdx', '')
    //   const markdownWithMeta = fs.readFileSync(
    //     path.join('data/posts', filename),
    //     'utf-8'
    //   )
    //   const { data } = matter(markdownWithMeta)

    //   return { ...data, slug }
    // })

    const asyncFiles = Promise.all(
      fileTypes?.map(async (file) => {
        let fileTypes = []
        let imageTypes = []
        let otherTypes = []

        const type = await fileTypeFromFile(`public/uploads/${file}`)
        if (type?.mime?.startsWith('image')) {
          return imageTypes.push({ type, name: file })
        }
        if (type?.mime?.startsWith('application')) {
          return fileTypes.push({ type, name: file })
        }

        return otherTypes.push({ type, name: file })
      })
    )
    console.log(fileTypes)

    const data = await asyncFiles

    res.status(200).json({ media: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
