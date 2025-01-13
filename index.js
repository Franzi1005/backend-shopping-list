import express from 'express'
import Joi from 'joi'

import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import {
  getShoppingItems,
  createShoppingItem,
  deleteShoppingItem,
  updateShoppingItem,
} from './database.js'

const app = express()
app.use(cors())
app.use(express.json())

function validateShoppingItem(shoppingItem) {
  const schema = Joi.object({
    item_id: Joi.string(),
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

app.get(`/api/shoppingItems`, async (req, res) => {
  const shoppingItems = await getShoppingItems()
  res.send(shoppingItems)
})

app.post('/api/shoppingItems', async (req, res) => {
  const result = validateShoppingItem(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const { item_id = uuidv4(), name, amount } = req.body
  const shoppingItem = await createShoppingItem(item_id, name, amount)
  res.status(201).send(shoppingItem)
})

app.put('/api/shoppingItems/:id', async (req, res) => {
  const shoppingItems = await getShoppingItems()
  const shoppingItem = shoppingItems.find(
    (item) => item.item_id === req.params.id
  )
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  shoppingItem.bought = !!shoppingItem.bought
  const result = validateShoppingItem(shoppingItem)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const updatedShoppingItem = await updateShoppingItem(
    req.body.item_id,
    req.body.name,
    req.body.amount,
    req.body.bought
  )
  // shoppingItem.name = req.body.name
  // shoppingItem.amount = req.body.amount
  // shoppingItem.bought = req.body.bought
  res.send(updatedShoppingItem)
})

app.delete('/api/shoppingItems/:id', async (req, res) => {
  const shoppingItems = await getShoppingItems()
  const shoppingItem = shoppingItems.find(
    (item) => item.item_id === req.params.id
  )
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  await deleteShoppingItem(shoppingItem.item_id)
  res.send(shoppingItems)
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
