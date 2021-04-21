import { dbQuery } from '~/server/config'
import { formatGet } from '~/server/utils'

export default async (req, res) => {
  return formatGet(req, res, async (params, tokenData) => {
    const { id } = tokenData

    let code = -1
    let msg = ''
    let data

    if (id === 0) {
      code = -3
      msg = '未登录，获取数据失败'
    } else {
      try {
        const queryData = await dbQuery(`SELECT id, username, nickname FROM user_data WHERE userid='${id}'`)
        if (queryData.length > 0) {
          code = 0
          msg = '成功'
          data = queryData[0]
        } else {
          msg = '查无数据'
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