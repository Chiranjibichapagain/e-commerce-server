import request from 'supertest'

import Movie, { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

async function createProduct(override?: Partial<ProductDocument>) {
  let product = {
    name: 'i phone 8',
    description: 'very nice apple phone',
    price: 1000,
    category: 'electronics',
    image: 'image url'
  }

  if (override) {
    product = { ...product, ...override }
  }

  return await request(app)
    .post('/api/products')
    .send(product)
}

describe('product controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a product', async () => {
    const res = await createProduct()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('i phone 8')
  })

  it('should not create a product with wrong data', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Samsung galaxy s9',
        price: 899,
        // These fields should be included
        // category: electronics,
        description:'very nice apple phone'
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app)
      .get(`/api/products/${productId}`)

    expect(res.body._id).toEqual(productId)
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app)
      .get(`/api/products/${nonExistingProductId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all product', async () => {
    const res1 = await createProduct({
        name: 'samsung tv',
        price: 600,
        category: 'electronics',
        description: 'very good tv',
        image:'samsung tv image'
      
    })
    const res2 = await createProduct({
        name: 'gold chain',
        price: 2000,
        description: 'very expensive item',
        category: 'jewellary',
        image:'image of gold chain'
      
    })

    const res3 = await request(app)
      .get(`/api/products`)

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    const update = {
        name: 'i phone 8 plus',
        description: 'very expensive apple phone',
        price: 1500,
        category: 'electronics',
        image: 'i phone plus image url'
    }

    res = await request(app)
      .put(`/api/products/${productId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('i phone 8 plus')
    expect(res.body.price).toEqual(1500)
  })

  it('should delete an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    const productId = res.body._id

    res = await request(app)
      .delete(`/api/products/${productId}`)

    expect(res.status).toEqual(204)

    res = await request(app)
      .get(`/api/cdproducts/${productId}`)
    expect(res.status).toBe(404)
  })
})