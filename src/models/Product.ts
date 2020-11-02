import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
   
})

export default mongoose.model<ProductDocument>('Product', productSchema)
