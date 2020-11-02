import express from 'express'
import passport from 'passport'

import { googleLogin } from '../controllers/googleLogin'

const router = express.Router()

router.post(
  '/google-authenticate',
  passport.authenticate('google-id-token'),
  googleLogin
)



export default router
