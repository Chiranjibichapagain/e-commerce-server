import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../util/secrets'

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.get('authorization')
  if (!token) return res.status(401).send('excess denied')

  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).send('Token not found or invalid token')
  }
}
