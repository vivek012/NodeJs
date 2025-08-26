const User = require('./../Models/usermodel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')

exports.signup = asyncErrorHandler(async  (req, res, next)=>{
    const newUser =  await User.create(req.body)

    const token = jwt.sign({id: newUser._id}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
    
    res.status(200).json({
        status:'success',
        token,
        data:{
            user : newUser
        }
    })
})