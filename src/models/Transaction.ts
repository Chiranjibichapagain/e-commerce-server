import mongoose, { Document } from 'mongoose'

export type TransactionDocument = Document & {
  user:string,
  checkout:[]
}

const transactionSchema = new mongoose.Schema({
  user:String,
  checkout:[]
})

export default mongoose.model<TransactionDocument>('Transaction', transactionSchema)
