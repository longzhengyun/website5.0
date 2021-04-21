import { dbQuery } from '~/server/config'
import { formatPost, checkName, checkPassword, encodeToken } from '~/server/utils'

export default async (req, res) => {
  return formatPost(req, res, async (params, tokenData) => {
    const { username = '', password1 = '', password2 = '' } = params
    const { id } = tokenData

    let code = -1
    let msg = ''
    let data

    if (id !== 0) {
      msg = '已登录，注册失败'
    } else {
      if (!checkName(username)) {
        msg = '参数出错: username'
      } else if (!checkPassword(password1)) {
        msg = '参数出错: password'
      } else if (password1 !== password2) {
        msg = '参数出错: 密码不一致'
      } else {
        try {
          const queryData = await dbQuery(`SELECT * FROM admin_data WHERE username='${username}'`)
          if (queryData.length > 0) {
            msg = '该账号已存在'
          } else {
            await dbQuery(`INSERT INTO admin_data VALUES (NULL, '${username}', '${password1}')`)

            const token = encodeToken({
              id: _query.id, // 账户id
              username: _query.username, // 账户名
            })

            code = 0
            msg = '注册成功'
            data = { token }

            const now = new Date().getTime()
            const expires = new Date(now + 1000 * 60 * 60)
            const path = '/'
            res.setHeader('Set-Cookie', `token=${token}`, { expires, path })
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