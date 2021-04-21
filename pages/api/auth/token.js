import { formatGet, encodeToken } from '~/server/utils'

export default async (req, res) => {
  return formatGet(req, res, async (params, tokenData) => {
    const { id } = tokenData

    let code = -1
    let msg = ''
    let data

    if (id !== 0) {
      msg = '已登录，获取token失败'
    } else {
      const token = encodeToken({
        id: 0, // 未登录id
        username: '', // 账户名为空
      })

      code = 0
      msg = '获取token'
      data = { token }

      const now = new Date().getTime()
      const expires = new Date(now + 1000 * 60 * 60)
      const path = '/'
      res.setHeader('Set-Cookie', `token=${token}`, { expires, path })
    }

    return {
      code,
      msg,
      data,
    }
  })
}