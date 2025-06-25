import express from 'express'
const router = express.Router()
import Joi from 'joi'
import { getUserByEmail } from '../database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(6).max(255),
  })
  const result = schema.validate(req)
  return result
}

router.post('/', async (req, res) => {
  const loginAttempt = validateAuth(req.body)
  if (loginAttempt.error) {
    return res.status(401).send('Invalid email or password')
  } else {
    const user = await getUserByEmail(req.body.email)
    if (!user) return res.status(401).send('Invalid email or password')

    const password = await bcrypt.compare(req.body.password, user[0].password)
    if (!password) return res.status(401).send('Invalid email or password')

    const token = jwt.sign({ user_id: user[0].user_id }, process.env.JWT_SECRET)

    res.status(200).send(token)
  }
})

export default router
