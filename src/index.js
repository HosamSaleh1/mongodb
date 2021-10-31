require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors')

require('./db/mongoose')

app.use(express.json())
app.use(cors())

app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('Server is running ...')
})















// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test');

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));