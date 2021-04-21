import { dbQuery } from '~/server/config'
import { formatPost, encodeToken } from '~/server/utils'

export default async (req, res) => {
  return formatPost(req, res, async (params, tokenData) => {
    const { id, username } = tokenData

    let code = -1
    let msg = ''
    let data

    if (id === 0) {
      code = -3
      msg = '未登录，退出失败'
    } else {
      try {
        const queryData = await dbQuery(`SELECT * FROM admin_data WHERE id='${id}' AND username='${username}'`)
        if (queryData.length > 0) {
          const token = encodeToken({
            id: 0, // 未登录id
            username: '', // 账户名为空
          })

          code = 0
          msg = '退出成功'
          data = { token }

          const now = new Date().getTime()
          const expires = new Date(now + 1000 * 60 * 60)
          const path = '/'
          res.setHeader('Set-Cookie', `token=${token}`, { expires, path })
        } else {
          msg = '退出失败'
        }
      } catch (error) {
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