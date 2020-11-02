import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'

import Product from '../models/Product'
import User from '../models/User'
import ProductService from '../services/product'
import { JWT_SECRET } from '../util/secrets'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../helpers/apiError'
import tokenExtractor from '../middlewares/jwtHandler'

// POST /products
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, category, image } = req.body
    const token = tokenExtractor(req)
    const decodedToken = token && JWT.verify(token, JWT_SECRET)

    if (!(token || decodedToken)) {
      return res.status(401).json({ error: 'missing or invalid token' })
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
    })

    await ProductService.create(product)
    res.json(product)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /product/:productId
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const productId = req.params.productId
    const updatedProduct = await ProductService.update(productId, update)
    res.json(updatedProduct)
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// DELETE /products/:productId
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products/:productId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findById(req.params.productId))
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await ProductService.findAll(req.query))
  } catch (error) {
    next(new NotFoundError('Products not found', error))
  }
}
