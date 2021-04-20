export const PostFormat = async (req, res, callback) => {
  let statusCode = 403

  let result = {}

  if (req.method === 'POST') {
    statusCode = 200
    result = await callback()
  }

  res.status(statusCode).json(result)
}

export const GetFormat = async (req, res, callback) => {
  let statusCode = 403

  let result = {}

  if (req.method === 'GET') {
    statusCode = 200
    result = await callback()
  }

  res.status(statusCode).json(result)
}