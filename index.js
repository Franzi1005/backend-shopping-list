import express from 'express'
import cors from 'cors'
import shoppingItems from './routes/shoppingItems.js'
import users from './routes/users.js'
import auth from './routes/auth.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/shoppingItems', shoppingItems)
app.use('/api/users', users)
app.use('/api/auth', auth)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
