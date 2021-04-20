import Promise from 'bluebird'
import jwt from 'jsonwebtoken'

import { PostFormat } from '~/server/utils'
import { secret, dbQuery } from '~/server/config'

const verify = Promise.promisify(jwt.verify)

export default async (req, res) => {
  return PostFormat(req, res, async () => {
    const token = req.cookies.token

    let code = -1
    let msg = ''
    let data

    try {
      // 解码
      let { id, username } = await verify(token, secret)

      const queryData = await dbQuery(`SELECT * FROM admin_data WHERE id='${id}' AND username='${username}'`)
      if (Array.isArray(queryData) && queryData.length > 0) {
        code = 0
        msg = '退出成功'

        const expires = new Date()
        res.setHeader('Set-Cookie', 'token=', { expires })
      } else {
        msg = '退出失败'
      }
    } catch (error) {
      msg = error.message
    }

    return {
      code,
      msg,
      data,
    }
  })
}