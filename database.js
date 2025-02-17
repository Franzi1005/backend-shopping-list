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

export async function getShoppingItems() {
  const [rows] = await db.query('SELECT * FROM shopping_items')
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

export async function createUser(id, name, password) {
  const result = await db.query(
    'INSERT INTO users (user_id, user_name, password) VALUES(?, ?, ?)',
    [id, name, password]
  )
  return result
}
