import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import User, { UserDocument } from '../models/User'
import { JWT_SECRET } from '../util/secrets'
import tokenExtractor from '../middlewares/jwtHandler'

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

export const changePass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword } = req.body

    const extractedToken = tokenExtractor(req)

    const decodedToken=
      extractedToken && JWT.verify(extractedToken, JWT_SECRET)
    const { id } = (<any>decodedToken)

    const salt = 10
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const newPass = { password: hashedPassword }
    const updatedUser = await update(id, newPass)

    if (updatedUser) {
      res.send('Password Updated!!')
    }

    function update(
      userId: string,
      update: Partial<UserDocument>
    ): Promise<UserDocument> {
      return User.findById(userId)
        .exec()
        .then((user) => {
          if (!user) {
            throw new Error(`User ${userId} not found`)
          }

          if (update.password) {
            user.password = update.password
          }

          return user.save()
        })
    }
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
