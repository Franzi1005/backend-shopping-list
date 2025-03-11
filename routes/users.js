import express from 'express'
const router = express.Router()
import Joi from 'joi'
import { createUser } from '../database.js'
import bcrypt from 'bcrypt'

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    userName: Joi.string().required().min(6).max(55),
    password: Joi.string().required().min(6).max(255),
  })
  const result = schema.validate(user)
  return result
}

router.post('/', async (req, res) => {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  // TODO : check if user already exists

  const { userName, password, email } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const newUser = await createUser(userName, hashedPassword, email)
    res.status(201).send(newUser)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

export default router
