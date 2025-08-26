const User = require('./../Models/usermodel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError')

const signToken = id =>{
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body)

    const token = signToken(newUser._id)

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = asyncErrorHandler(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.email;

    // const {email , password} = req.body;
    if (!email || !password) {
        const error = new CustomError("Please Provide email ID & password for login In", 400);
        return next(error);
    }

    // chcking if user exist in the database or not 
    const user = await User.findOne({ email }).select("+password")


    const isMatch = await user.comparePasswordInDb(password, user.password)

    if(!user || !( await user.comparePasswordInDb(password, user.password))){
        const error = new CustomError('Incorrect email or password')
        return next(error)
    }

    const token = signToken(user._id)


    res.status(200).json({
        status: 'success',
        token,
        user
    })
})
