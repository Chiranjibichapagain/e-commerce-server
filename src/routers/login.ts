import express from 'express'

import { logUser } from '../controllers/login'

const router = express.Router()

router.post('/', logUser)

export default router
