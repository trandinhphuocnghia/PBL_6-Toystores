const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require ('cors')
const dotenv = require ('dotenv')
const fileupload = require ('express-fileupload')
const Mongodb = require('./Mongoose/mongoConnect')

//config
const app = express()
app.use(express.json())
dotenv.config()
app.use(cookieParser())
app.use(cors())
app.use(fileupload(
    {useTempFiles:true}
))

//build server
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`App listening at http://localhost:${port}`) 
})

//Connect to DB
Mongodb.Mongodbconnect()

// routes
app.get('/',(req,res)=>{
    res.json({msg:'Welcome '})
})
app.use('/user', require('./Routes/UsersRoute'))
