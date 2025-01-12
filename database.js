import mysql2 from 'mysql2'

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

async function getShoppingItems() {
  const [rows] = await db.query('SELECT * FROM shopping_items')
  return rows
}

const shoppingItems = await getShoppingItems()
console.log(shoppingItems)
