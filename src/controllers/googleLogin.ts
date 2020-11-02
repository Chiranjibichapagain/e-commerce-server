import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import tokenExtractor from '../middlewares/jwtHandler'
import User, { UserDocument } from '../models/User'
import { JWT_SECRET } from '../util/secrets'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /User
export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: UserDocument = req.user as UserDocument
    const { _id, admin, banned, firstName } = user
    const token = JWT.sign({ sub: _id }, JWT_SECRET, {
      expiresIn: '2h',
    })
    res.send({ token, admin, banned, name: firstName })
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'MongoError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

