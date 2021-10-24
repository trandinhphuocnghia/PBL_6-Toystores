const mongoose = require ('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const URI = process.env.MONGODB_URL

 const Mongodbconnect = async () => {

    try{
        await mongoose.connect(URI, {
            
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })

        console.log('connect to db susscessfully')
    }
    catch(error){
        console.log('connect failed!!!')
    }
}

module.exports={Mongodbconnect}