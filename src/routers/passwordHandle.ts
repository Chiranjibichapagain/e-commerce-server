import express from 'express'

import { forgetPass } from '../controllers/forgetPass'
import { changePass } from '../controllers/changePass'

const router = express.Router()

router.post('/forgetpass', forgetPass)
router.post('/changepass', changePass)

export default router
