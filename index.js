import express from 'express'
import Joi from 'joi'

import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
//const db = require('./database')

const app = express()

app.use(cors())

app.use(express.json())

let shoppingItems = [
  {
    id: uuidv4(),
    name: 'Käse',
    amount: 3,
    bought: false,
  },
  {
    id: uuidv4(),
    name: 'Brot',
    amount: 4,
    bought: false,
  },
  {
    id: uuidv4(),
    name: 'Milch',
    amount: 6,
    bought: false,
  },
]

function validateShoppingItem(shoppingItem) {
  const schema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    amount: Joi.number(),
    bought: Joi.boolean(),
  })
  const result = schema.validate(shoppingItem)
  return result
}

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get(`/api/shoppingItems`, (req, res) => {
  res.send(shoppingItems)
})

app.post('/api/shoppingItems', (req, res) => {
  const result = validateShoppingItem(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const shoppingItem = {
    id: uuidv4(),
    name: req.body.name,
    amount: req.body.amount,
    bought: false,
  }
  shoppingItems.push(shoppingItem)
  res.send(shoppingItem)
})

app.put('/api/shoppingItems/:id', (req, res) => {
  const shoppingItem = shoppingItems.find((item) => item.id === req.params.id)
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  const result = validateShoppingItem(shoppingItem)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  shoppingItem.name = req.body.name
  shoppingItem.amount = req.body.amount
  res.send(shoppingItem)
})

app.delete('/api/shoppingItems/:id', (req, res) => {
  const shoppingItem = shoppingItems.find((item) => item.id === req.params.id)
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  const index = shoppingItems.indexOf(shoppingItem)
  shoppingItems.splice(index, 1)
  res.send(shoppingItem)
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
