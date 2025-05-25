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
export async function getShoppingItems(shopping_list_id) {
  const [rows] = await db.query(
    'SELECT * FROM shopping_items WHERE shopping_list_id = ? ORDER BY bought, name',
    [shopping_list_id]
  )
  return rows
}

export async function createShoppingItem(id, name, amount, shopping_list_id) {
  const result = await db.query(
    'INSERT INTO shopping_items (item_id, name, amount, shopping_list_id) VALUES(?, ?, ?, ?)',
    [id, name, amount, shopping_list_id]
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

export async function getUser(id) {
  const user = await db.query('SELECT * FROM users WHERE user_id = ?', [id])
  return user[0].length > 0 ? user[0] : null
}

// Shopping lists
export async function getShoppingList(id, user_id) {
  const [rows] = await db.query(
    'SELECT * FROM shopping_lists WHERE shopping_list_id = ? AND user_id = ?',
    [id, user_id]
  )
  return rows
}

export async function getShoppingLists(user_id) {
  const [rows] = await db.query(
    'SELECT * FROM shopping_lists WHERE user_id = ?',
    [user_id]
  ) // TODO: WHERE user_id = user_id or something
  return rows
}

export async function createShoppingList(name, user_id) {
  // TODO: figure out how to get the user in there
  const result = await db.query(
    'INSERT INTO shopping_lists (sl_name, user_id) VALUES(?, ?)',
    [name, user_id]
  )
  return result
}

export async function updateShoppingList(name, shopping_list_id) {
  const result = await db.query(
    'UPDATE shopping_lists SET sl_name = ? WHERE shopping_list_id = ?',
    [name, shopping_list_id]
  )
  return result
}

export async function deleteShoppingList(id) {
  const result = await db.query(
    'DELETE FROM shopping_lists WHERE shopping_list_id = ?',
    [id]
  )
  return result
}
