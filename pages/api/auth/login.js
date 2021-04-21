import { dbQuery } from '~/server/config'
import { formatPost, checkName, checkPassword, encodeToken } from '~/server/utils'

export default async (req, res) => {
  return formatPost(req, res, async (params, tokenData) => {
    const { username = '', password = '' } = params
    const { id } = tokenData

    let code = -1
    let msg = ''
    let data

    if (id !== 0) {
      msg = '已登录，登录失败'
    } else {
      if (!checkName(username)) {
        msg = '参数出错: username'
      } else if (!checkPassword(password)) {
        msg = '参数出错: password'
      } else {
        try {
          const queryData = await dbQuery(`SELECT * FROM admin_data WHERE username='${username}'`)
          if (queryData.length > 0) {
            const _query = queryData[0]
            if (_query.password === password) {
              const token = encodeToken({
                id: _query.id, // 账户id
                username: _query.username, // 账户名
              })

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
          msg = error.message
        }
      }
    }

    return {
      code,
      msg,
      data,
    }
  })
}