import express from 'express'
const router = express.Router()
import auth from '../middleware/auth'
import Joi from 'joi'

import {
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '../database'

function validateShoppingList(shoppingList) {
  const schema = Joi.object({
    name: Joi.string().required(),
  })
  const result = schema.validate(shoppingList)
  return result
}

router.get('/', auth, async (req, res) => {
  const shoppingLists = await getShoppingLists()
  res.send(shoppingLists)
})

router.get('/:id', auth, async (req, res) => {
  const shoppingLists = await getShoppingLists()
  const shoppingList = shoppingLists.find((list) => list.id === req.params.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  res.send(updatedShoppingList)
})

router.post('/', auth, async (req, res) => {
  const result = validateShoppingList(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const { name } = req.body
  const shoppingList = await createShoppingList(name)
  res.status(201).send(shoppingList)
})

router.put('/:id', auth, async (req, res) => {
  const shoppingLists = await getShoppingLists()
  const shoppingList = shoppingLists.find((list) => list.id === req.params.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  const updatedShoppingList = await updateShoppingList(
    // TODO: update logic here
    req.params.id,
    req.body.name || shoppingList.name
  )
  res.send(updatedShoppingList)
})

router.delete('/:id', auth, async (req, res) => {
  const shoppingLists = await getShoppingLists()
  const shoppingList = shoppingLists.find((list) => list.id === req.params.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  await deleteShoppingList(shoppingList.id)
  res.send(shoppingList)
})
