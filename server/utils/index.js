import { promisify } from 'bluebird'
import { sign, verify } from 'jsonwebtoken'

import { secret } from '~/server/config'

const jwtVerify = promisify(verify)

// 编码token
export const encodeToken = (data = {}) => {
  return sign(data, secret, { expiresIn: 60 * 60 })
}

// 解码token
export const decodeToken = async (token = '') => {
  if (token) {
    try {
      return await jwtVerify(token, secret)
    } catch (error) {
      return undefined
    }
  } else {
    return undefined
  }
}

// 自定义post请求
export const formatPost = async (req, res, callback) => {
  let statusCode = 403

  let result

  if (req.method === 'POST') {
    statusCode = 200

    // 解码
    const tokenData = await decodeToken(req.cookies.token)
    if (tokenData) {
      result = await callback(req.body || {}, tokenData)
    } else {
      result = {
        code: -2,
        msg: 'token已失效',
      }
    }
  }

  res.status(statusCode).json(result)
}

// 自定义get请求
export const formatGet = async (req, res, callback) => {
  let statusCode = 403

  let result

  if (req.method === 'GET') {
    statusCode = 200

    // 解码
    const tokenData = await decodeToken(req.cookies.token)
    if (tokenData) {
      result = await callback(req.query, tokenData)
    } else {
      if (req.url === '/api/auth/token') {
        result = await callback(req.query, { id: 0, username: '' })
      } else {
        result = {
          code: -2,
          msg: 'token已失效',
        }
      }
    }
  }

  res.status(statusCode).json(result)
}

// 验证用户名
export const checkName = (name = '') => {
  let result = false
  let reg = new RegExp('^[a-zA-Z]{6,16}$') // 用户名长度 6-16个字符 仅限大小写字母

  if (name.match(reg)) {
    result = true
  }

  return result
}

// 验证密码
export const checkPassword = (password = '') => {
  let result = false
  let reg = new RegExp('^[a-zA-Z0-9]{6,16}$') // 密码长度 6-16个字符 仅限大小写字母、数字

  if (password.match(reg)) {
    result = true
  }

  return result
}