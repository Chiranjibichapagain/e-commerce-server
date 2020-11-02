
import Product, { ProductDocument } from '../models/Product'

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec() // .exec() will return a true Promise
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    }) 
}

function findAll(query: any): Promise<ProductDocument[]> {
  const page = query.page ? parseInt(query.page) : 1
  const limit = query.page ? parseInt(query.limit) : 100

  const price = query.pricelt && query.pricegt
  if (query.category && query.pricelt && query.pricegt) {
    const gt = parseInt(query.pricegt)
    const lt = parseInt(query.pricelt)
    return Product.find({
      category: { $eq: query.category },
      price: { $gte: gt, $lte: lt },
    }).populate("User", {name:1, email:1})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 })
      .exec()
  }
  if (query.pricelt && query.pricegt) {

    const gt = parseInt(query.pricegt)
    const lt = parseInt(query.pricelt)
    return Product.find({ price: { $gte: gt, $lte: lt } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 })
      .exec()
  }

  if (query.name) {

    return Product.find({ name: { $regex: query.name, $options: 'i' } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 })
      .exec()
  }
  if (query.category) {

    return Product.find({ category: { $eq: query.category } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 })
      .exec()
  }

  
  return Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ name: 1 })
    .exec()
}

function update(
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`product ${productId} not found`)
      }

      if (update.name) {
        product.name = update.name
      }
      if (update.description) {
        product.description = update.description
      }

      if (update.price) {
        product.price = update.price
      }
      if (update.category) {
        product.category = update.category
      }
      if (update.image) {
        product.image = update.image
      }

      return product.save()
    })
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteProduct,
}
