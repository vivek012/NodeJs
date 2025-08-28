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
    if(testToken && testToken.startsWith('Bearer')){
    token =  testToken.split(' ')[1]
    }
    
    if(!token){
        next(new CustomError('You are not logged in!', 401))
    }
    
    //2. Validate the token

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR );
     
    console.log(decodedToken)
    //3. If the user exists
    const user = await User.findById(decodedToken.id)

    if(!user){
        const error = CustomError('The user with the given token does not exist', 401)
        next(error);
    } 

    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    //4. If the user changed password after the token was issued
    if(isPasswordChanged){
        const error = new CustomError('The password has been changed recently. Please login again', 401)
        return next(error)
    };
    //  5 . All user  to access route

    req.user = user;
    next();  

})

exports.restrict = (role) =>{
    return (req , res , next)=>{
        if(req.user.role !== 'admin'){
            const error = new CustomError('You do not have peremission to perform this action', 403)
            next(error)
        }
        next();
    }
}
