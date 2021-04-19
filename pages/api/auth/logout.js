import Promise from 'bluebird'
import jwt from 'jsonwebtoken'

import { secret, dbQuery } from '~/server/config'

const verify = Promise.promisify(jwt.verify)

export default async (req, res) => {
  const result = {
    code: -1,
    msg: '',
    data: null
  }

  let statusCode = 403

  if (req.method === 'POST') {
    statusCode = 200

    const token = req.cookies.token

    try {
      // 解码
      let { userid } = await verify(token, secret)

      const data = await dbQuery(`SELECT id, nickname FROM admin_data WHERE id='${userid}'`)
      if (Array.isArray(data) && data.length > 0) {
        result.code = 0
        result.msg = '退出成功'
      } else {
        result.msg = '退出失败'
      }
    } catch (error) {
      result.msg = error
    }
  }

  if (result.code === 0) {
    const expires = new Date()
    res.setHeader('Set-Cookie', 'token=', { expires })
  }

  res.status(statusCode).json(result)
}