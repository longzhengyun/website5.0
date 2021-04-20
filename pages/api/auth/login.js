import jwt from 'jsonwebtoken'

import { PostFormat } from '~/server/utils'
import { secret, dbQuery } from '~/server/config'

export default async (req, res) => {
  return PostFormat(req, res, async () => {
    const { username = '', password = '' } = req.body

    let code = -1
    let msg = ''
    let data

    try {
      const queryData = await dbQuery(`SELECT * FROM admin_data WHERE username='${username}'`)
      if (Array.isArray(queryData) && queryData.length > 0) {
        const _query = queryData[0]
        if (_query.password === password) {
          const token = jwt.sign({
            id: _query.id, // 账户id
            username: _query.username, // 账户名
          }, secret, { expiresIn: 60 * 60 })

          code = 0
          msg = '登录成功'
          data = { token }

          const now = new Date().getTime()
          const expires = new Date(now + 1000 * 60 * 60)
          const path = '/'
          res.setHeader('Set-Cookie', `token=${token}`, { expires, path })
        } else {
          msg = '密码不正确!'
        }
      } else {
        msg = '查无此账号'
      }
    } catch (error) {
      if (!username) {
        msg = '参数出错: username'
      } else if (!password) {
        msg = '参数出错: password'
      } else {
        msg = error.message
      }
    }

    return {
      code,
      msg,
      data,
    }
  })
}