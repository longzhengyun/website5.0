import Promise from 'bluebird'
import jwt from 'jsonwebtoken'

import { GetFormat } from '~/server/utils'
import { secret, dbQuery } from '~/server/config'

const verify = Promise.promisify(jwt.verify)

export default async (req, res) => {
  return GetFormat(req, res, async () => {
    const token = req.cookies.token

    let code = -1
    let msg = ''
    let data

    try {
      // 解码
      let { id } = await verify(token, secret)

      const queryData = await dbQuery(`SELECT id, username, nickname FROM user_data WHERE userid='${id}'`)
      if (Array.isArray(queryData) && queryData.length > 0) {
        code = 0
        msg = '成功'
        data = queryData[0]
      } else {
        msg = '查无数据'
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