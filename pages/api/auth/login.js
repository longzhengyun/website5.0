import jwt from 'jsonwebtoken'

import { secret, dbQuery } from '~/server/config'

export default async (req, res) => {
  const result = {
    code: -1,
    msg: '',
    data: null
  }

  let statusCode = 403

  if (req.method === 'POST') {
    statusCode = 200

    const { username = '', password = '' } = req.body

    try {
      const data = await dbQuery(`SELECT * FROM admin_data WHERE username='${username}'`)
      if (Array.isArray(data) && data.length > 0) {
        const res = data[0]
        if (res.password === password) {
          const token = jwt.sign({
            userid: res.id, // 账户id
            username: res.username, // 账户名
          }, secret, { expiresIn: 60 * 60 })

          result.code = 0
          result.msg = '登录成功'
          result.data = { token, userid: res.id, username: res.username, nickname: res.nickname }
        } else {
          result.msg = '密码不正确!'
        }
      } else {
        result.msg = '查无此账号'
      }
    } catch (error) {
      if (!username) {
        result.msg = '参数出错: username'
      } else if (!password) {
        result.msg = '参数出错: password'
      } else {
        result.msg = error
      }
    }
  }

  if (result.code === 0) {
    const now = new Date().getTime()
    const expires = new Date(now + 1000 * 60 * 60)
    res.setHeader('Set-Cookie', `token=${result.data.token}`, { expires })
  }

  res.status(statusCode).json(result)
}