import express from 'express'

import { createTransaction, findById, deleteTransaction, updateTransaction } from '../controllers/checkout'

const router = express.Router()

router.post('/', createTransaction)
router.get('/:transactionId', findById)
router.put('/:transactionId', updateTransaction)
router.delete('/:transactionId', deleteTransaction)

export default router
