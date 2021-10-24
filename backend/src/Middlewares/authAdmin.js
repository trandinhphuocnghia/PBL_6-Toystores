const Users = require('../Model/UsersModel')

// check if  who have role === 1 is Admin.
const authAdmin = async (req,res,next) => {
    try{
        const user = await Users.findOne({

            _id: req.user.id
        })
        if(user.role === 0) return res.status(400).json({msg:"Failed Authentication!, Admin access denied!"})

    }catch(err){
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin
