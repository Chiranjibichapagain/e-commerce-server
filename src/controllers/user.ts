import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /User
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const checkExistance = await User.find({ email: email })

    if (checkExistance.length>0) {
      return res
        .status(401)
        .json({ error: 'Email already in use' })
    }

    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      
    })


    await UserService.create(user)
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'MongoError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /user/:userId
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, admin, banned } = req.body
    const update = {
      firstName,
      lastName,
      email,
      admin,
      banned,
    }
    const userId = req.params.userId
    const updatedUser = await UserService.update(userId, update)
    res.json(updatedUser)
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// DELETE /user/:userId
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /users/:userId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// GET /users
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAll())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}
