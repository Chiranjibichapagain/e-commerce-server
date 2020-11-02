import { Request } from 'express'

const tokenExtractor = (request: Request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}

export default tokenExtractor
