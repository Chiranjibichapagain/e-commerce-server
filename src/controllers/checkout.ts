import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

import User from '../models/User'
import Transaction from '../models/Transaction'
import CheckoutService from '../services/checkout'
import { JWT_SECRET } from '../util/secrets'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'


// POST /Transaction
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const body=req.body
    
    const decodedToken= JWT.verify(body.token, JWT_SECRET)
    const {sub} = (<any>decodedToken)
    
    const newTtransaction = new Transaction({
      user:sub,
      checkout:body.products
    })

    const transaction= await CheckoutService.create(newTtransaction)
    res.json(transaction)

    const user = await User.findById(sub)
    if (user) {
      user.transactions=user.transactions.concat(transaction._id)
    }
    await user?.save()
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}


// PUT /Transaction/:transactionId
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { products } = req.body
    const update = {
      checkout:products
    }
    const transactionId = req.params.transactionId
    const updatedTransaction = await CheckoutService.update(transactionId, update)
    res.json(updateTransaction)
  } catch (error) {
    next(new NotFoundError('Transaction not found', error))
  }
}

// DELETE /transaction/:transactionId
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await CheckoutService.deleteTransaction(req.params.transactionId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Transaction not found', error))
  }
}

// GET /transaction/:transactionId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await CheckoutService.findById(req.params.transactionId))
  } catch (error) {
    next(new NotFoundError('Transaction not found', error))
  }
}

// GET /transactions
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await CheckoutService.findAll())
  } catch (error) {
    next(new NotFoundError('Transactions not found', error))
  }
}

