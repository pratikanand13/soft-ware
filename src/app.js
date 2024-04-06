const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/userRoutes')
const chatRouter = require('./routes/chatRoutes')
const requestRouter = require('./routes/requestRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(chatRouter)
app.use(requestRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})