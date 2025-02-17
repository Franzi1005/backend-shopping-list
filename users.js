import express from 'express'
import Joi from 'joi'

import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { createUser } from './database.js'

const app = express()
app.use(cors())
app.use(express.json())

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().required().min(6).max(55),
    password: Joi.string().required().min(6).max(55),
  })
  const result = schema.validate(user)
  return result
}

app.post('/api/users', async (req, res) => {
  const result = validateUser(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const { userId = uuidv4(), userName, password } = req.body
  const newUser = await createUser(userId, userName, password)
  res.status(201).send(newUser)
})
