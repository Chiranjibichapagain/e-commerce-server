import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

import User from '../models/User'
import { JWT_SECRET } from '../util/secrets'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /User
export const logUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body
    const user = await User.findOne({ email: body.email })
    const checkPassword =
      user === null ? false : await bcrypt.compare(body.password, user.password)

    if (!(user && checkPassword)) {
      return res
        .status(401)
        .json({ error: 'invalid username and/or password! Try again' })
    }

    const userToken = {
      email: user.email,
      id: user._id,
    }

    const email = user.email
    const name = user.firstName
    const banned = user.banned
    const admin = user.admin

    const token = JWT.sign(userToken, JWT_SECRET, { expiresIn: '2h' })

    res.status(200).send({ token, email, name, banned, admin })
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}
