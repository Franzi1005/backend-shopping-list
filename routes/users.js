import express from 'express'
const router = express.Router()
import Joi from 'joi'
import { createUser, getUser } from '../database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import auth from '../middleware/auth.js'

dotenv.config()

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    userName: Joi.string().required().min(6).max(55),
    password: Joi.string().required().min(6).max(255),
  })
  const result = schema.validate(user)
  return result
}

router.get('/me', auth, async (req, res) => {
  const user = await getUser(req.user.user_id)
  res.send(user)
})

router.post('/', async (req, res) => {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)

  const { userName, password, email } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const newUser = await createUser(userName, hashedPassword, email)
    const token = jwt.sign(
      { userId: newUser.user_id },
      process.env.JWT_SECRET
    )
    res.header('x-auth-token', token).status(201).send(newUser)
  } catch (error) {
    console.error("User creation failed:", error)
    res.status(409).send(error.message)
  }
})

export default router
