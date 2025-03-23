import express from 'express'
const router = express.Router()
import auth from '../middleware/auth.js'
import Joi from 'joi'

import {
  getShoppingList,
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '../database.js'

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
  const shoppingList = await getShoppingList(req.params.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  res.send(shoppingList[0])
})

router.post('/', auth, async (req, res) => {
  const result = validateShoppingList(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  const { name } = req.body
  const shoppingList = await createShoppingList(name)
  res.status(201).send(shoppingList)
})

router.put('/:id', auth, async (req, res) => {
  const shoppingList = await getShoppingList(req.body.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  const updatedShoppingList = await updateShoppingList(
    req.body.name || shoppingList.name,
    req.params.id
  )
  res.send(updatedShoppingList)
})

router.delete('/:id', auth, async (req, res) => {
  const shoppingList = await getShoppingList(req.params.id)
  if (!shoppingList) return res.status(404).send('List not found😢🦉')
  await deleteShoppingList(shoppingList[0].shopping_list_id)
  res.send(shoppingList)
})

export default router
