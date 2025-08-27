const User = require('./../Models/usermodel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('./../Utils/CustomError')
const util = require('util')

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
    const password = req.body.password;

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
        token
    })
})

exports.protect = asyncErrorHandler(async (req, res, next)=>{
    //1. Read the token & check if it exist
    const testToken = req.headers.authorization

    let token
    if(testToken && testToken.startsWith('bearer')){
    token =  testToken.split(' ')[1]
    }
    
    if(!token){
        next(new CustomError('You are not logged in!', 401))
    }
    
    //2. Validate the token

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR );

    console.log(decodedToken)
    //3. Read the token & check if it exist
    //4. Read the token & check if it exist

    next();  

})
