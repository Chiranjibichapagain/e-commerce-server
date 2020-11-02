import express from 'express'

import {
  createUser,
  findById,
  deleteUser,
  findAll,
  updateUser,
} from '../controllers/user'

const router = express.Router()

router.get('/', findAll)
router.get('/:userId', findById)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)
router.post('/', createUser)

export default router
