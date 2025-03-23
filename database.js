import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql2
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise()

// Shopping Items
export async function getShoppingItems() {
  const [rows] = await db.query(
    'SELECT * FROM shopping_items ORDER BY bought, name'
  )
  return rows
}

export async function createShoppingItem(id, name, amount) {
  const result = await db.query(
    'INSERT iNTO shopping_items (item_id, name, amount) VALUES(?, ?, ?)',
    [id, name, amount]
  )
  return result
}

export async function updateShoppingItem(id, name, amount, bought) {
  const result = await db.query(
    'UPDATE shopping_items SET name = ?, amount = ?, bought = ? WHERE item_id = ?',
    [name, amount, bought, id]
  )
  return result
}

export async function deleteShoppingItem(id) {
  const result = await db.query(
    'DELETE FROM shopping_items WHERE item_id = ?',
    [id]
  )
  return result
}

// Users
export async function createUser(name, password, email) {
  const user = await getUserByEmail(email)
  if (user) {
    throw new Error('Email already in use!')
  } else {
    const result = await db.query(
      'INSERT INTO users (user_name, password, email) VALUES(?, ?, ?)',
      [name, password, email]
    )
    return result
  }
}

export async function getUserByEmail(email) {
  const user = await db.query('SELECT * FROM users WHERE email = ?', [email])
  return user[0].length > 0 ? user[0] : null
}

// Shopping lists
export async function getShoppingLists(params) {
  // TODO: impelement logic
  const [rows] = await db.query(
    'SELECT * FROM shopping_lists' // WHERE user_id = ??
  )
  return rows
}

export async function createShoppingList(name) {
  // TODO: impelement logic
  const result = await db.query('INSERT iNTO shopping_lists (name) VALUES(?)', [
    name,
  ])
  return result
}

export async function updateShoppingList(params) {
  // TODO: impelement logic
}

export async function deleteShoppingList(id) {
  const result = await db.query(
    'DELETE FROM shopping_lists WHERE item_id = ?',
    [id]
  )
  return result
}
