import express from 'express'
import cors from 'cors'
import shoppingItems from './routes/shoppingItems.js'
import users from './routes/users.js'
import auth from './routes/auth.js'
import shoppingLists from './routes/shoppingLists.js'

const app = express()
app.use(express.json())

const corsOptions = {
  exposedHeaders: ['x-auth-token'],
}
app.use(cors(corsOptions))
app.use('/api/shoppingLists/', shoppingItems)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/shoppingLists', shoppingLists)

const port = process.env.PORT || 5001

app.listen(port, () => console.log(`Listening on port ${port}`))
