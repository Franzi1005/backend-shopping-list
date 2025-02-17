import express from 'express'
import cors from 'cors'
import shoppingItems from './routes/shoppingItems.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/shoppingItems', shoppingItems)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
