//import
const Users = require('../Model/UsersModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



const  UserController = {

    //register customer.
    register: async(req,res) => {
        try{
            const {name,email,password} = req.body;
            //check exist email .
            const user = await Users.findOne({email})
            if(!user){
                if(password.length > 8){
                    return res.status(400).json({msg: "Password is at maximum 8 characters long."})
                }

                //hash password
                const passwordhash = await bcrypt.hash(password,10)
                const newUser = new Users({
                    name,
                    email,
                    password:passwordhash
                }) 

                //db save new customer info.
                await newUser.save()

                // jwt to authenticated ( about : accesstoken , refresh token). 
                const accesstoken = createAccessToken({id: newUser._id})
                const refreshtoken = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken',refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 
                })
                res.json({msg: "Register Success! Please activate your email to start."})
            }else{
                return res.status(400).json({msg:"The email alredy exists !!!"})

            }

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    //refresh token.
    refreshToken: (req,res) => {
       try{
        // check if rf token was send in cookie died.   
        const rf_token = req.cookies.refreshtoken;
        console.log(rf_token)
        if(!rf_token) return res.status(400).json({msg: "Please Login again, or you weren't Register!!!"})

        //if have rf_token.
        jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err,user) => {
            if(err) return res.status(400).json({msg: "Please Login again, or you weren't Register!!!"})
            // create new accesstoken 
            const accesstoken = createAccessToken({id: user.id})
            res.json({accesstoken})
        }) 
        
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
    },

    //login customer.
    login: async (req,res) => {
        try {
            const {email, password} = req.body;
           
            const user = await Users.findOne({email})
        
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //logout customer.
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    //get Customer's infomation
    getCustomerinfo: async (req,res) => {
        try{
            const user = await Users.findById(req.user.id).select('-password')
            //console.log(user)
            if(!user) return res.status(400).json({msg: "User does not exist."})

           res.json(user)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    }

}


//function
const createAccessToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN, {expiresIn: '11m'}) // access token is alive 11m.
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '7d'}) // refresh token is alive 7day.
}


module.exports = UserController