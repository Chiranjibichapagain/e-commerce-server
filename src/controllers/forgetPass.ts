import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'

import User from '../models/User'
import mailgun from '../config/mailgun'
import { JWT_SECRET } from '../util/secrets'

// import { JWT_SECRET } from '../util/secrets'
// import loginService from '../services/login'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

//getUser with given email
export const forgetPass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body

    await User.findOne({
      email: email.email,
    })
      .exec()
      .then((user) => {
        if (user) {
          const userToken = {
            email: user.email,
            id: user._id,
          }
          const token = JWT.sign(userToken, JWT_SECRET)

          mailgun(user.email, token)
        }
        if (!user) {
          res.send('user not found')
        }
      })
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}
