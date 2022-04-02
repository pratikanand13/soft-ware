const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{})
.then(ok=>console.log('MongoDb connected'))
.catch(err=>console.log(err))