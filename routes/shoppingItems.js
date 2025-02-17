import express from 'express'
const router = express.Router()
//router.use(express.json())

import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import {
  getShoppingItems,
  createShoppingItem,
  deleteShoppingItem,
  updateShoppingItem,
} from '../database.js'

function validateShoppingItem(shoppingItem) {
  const schema = Joi.object({
    item_id: Joi.string(),
    name: Joi.string().required(),
    amount: Joi.number().integer().min(1),
    bought: Joi.boolean(),
  })
  const result = schema.validate(shoppingItem)
  return result
}

router.get('/', async (req, res) => {
  const shoppingItems = await getShoppingItems()
  res.send(shoppingItems)
})

router.post('/', async (req, res) => {
  const result = validateShoppingItem(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const { item_id = uuidv4(), name, amount } = req.body
  const shoppingItem = await createShoppingItem(item_id, name, amount)
  res.status(201).send(shoppingItem)
})

router.put('/:id', async (req, res) => {
  const shoppingItems = await getShoppingItems()
  const shoppingItem = shoppingItems.find(
    (item) => item.item_id === req.params.id
  )
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  shoppingItem.bought = !!shoppingItem.bought
  const result = validateShoppingItem(shoppingItem)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const updatedShoppingItem = await updateShoppingItem(
    req.params.id,
    req.body.name || shoppingItem.body.name,
    req.body.amount || shoppingItem.body.amount,
    req.body.bought
  )
  res.send(updatedShoppingItem)
})

router.delete('/:id', async (req, res) => {
  const shoppingItems = await getShoppingItems()
  const shoppingItem = shoppingItems.find(
    (item) => item.item_id === req.params.id
  )
  if (!shoppingItem) return res.status(404).send('Item not found😢🐋')
  await deleteShoppingItem(shoppingItem.item_id)
  res.send(shoppingItems)
})

export default router
