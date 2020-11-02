import Transaction, { TransactionDocument } from '../models/Transaction'

function create(transaction: TransactionDocument): Promise<TransactionDocument> {
  return transaction.save()
}

function findById(transactionId: string): Promise<TransactionDocument> {
  return Transaction.findById(transactionId)
    .exec() // .exec() will return a true Promise
    .then((transaction) => {
      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`)
      }
      return transaction
    })
}

function findAll(): Promise<TransactionDocument[]> {
  return Transaction.find().populate('transactions', {checkout:1}).sort({ firstName: 1 }).exec() // Return a Promise
}

function update(
  transactionId: string,
  update: Partial<TransactionDocument>
): Promise<TransactionDocument> {
  return Transaction.findById(transactionId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`Transaction ${transactionId} not found`)
      }

      if (update.checkout) {
        user.checkout = update.checkout
      }
      

      return user.save()
    })
}

function deleteTransaction(transactionId: string): Promise<TransactionDocument | null> {
  return Transaction.findByIdAndDelete(transactionId).exec()
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteTransaction,
}
