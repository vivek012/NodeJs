const User = require('./../Models/usermodel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError')
const util = require('util');
const sendEmail = require('./../Utils/email')
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

const createSendResponse= (user, statusCode, res)=>{
     const token = signToken(user._id)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body)
    createSendResponse(newUser, 201,res);
 
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

    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect email or password')
        return next(error)
    }

     createSendResponse(user, 200,res);

})

exports.protect = asyncErrorHandler(async (req, res, next) => {
    //1. Read the token & check if it exist
    const testToken = req.headers.authorization

    let token
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1]
    }

    if (!token) {
        next(new CustomError('You are not logged in!', 401))
    }

    //2. Validate the token

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    console.log(decodedToken)
    //3. If the user exists
    const user = await User.findById(decodedToken.id)

    if (!user) {
        const error = CustomError('The user with the given token does not exist', 401)
        next(error);
    }

    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    //4. If the user changed password after the token was issued
    if (isPasswordChanged) {
        const error = new CustomError('The password has been changed recently. Please login again', 401)
        return next(error)
    };
    //  5 . All user  to access route

    req.user = user;
    next();

})

exports.restrict = (...role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            const error = new CustomError('You do not have peremission to perform this action', 403)
            next(error)
        }
        next();
    }
}


exports.forgetPassword = asyncErrorHandler(async (req, res, next) => {
    // GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        const error = new CustomError('we could not find the user with given email', 404);
        next(error);
    }

    // gENERATE A rANDDOM RESET TOKEN

    const resetToken = user.createResetPasswordToken();

    await user.save({ validateBeforeSave: false });


    // SEND THE TOKEN BACK TO THE USER EMAIL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\n This reset password link will be valid for 10 minutes.`

    try {
        await sendEmail({
            email: user.email,
            subject: ' Password change rquest received',
            message: message
        });

    } catch (err) {
        console.error("EMAIL SEND ERROR:", err);
        user.passwordResetToken = undefined
        user.passwordResetTokenExpire = undefined
        user.save({ validateBeforeSave: false })

        return next(new CustomError('There was an error sending password reset email. Please try again later', 500))
    }

    res.status(200).json({
        status: 'success',

    })
})

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    // 1. if THE USER EXISTS WITH THE GIVEN TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpire: { $gt: Date.now() }
    });
    if (!user) {
        const error = new CustomError('Token is invalid or has expired', 400)
        return next(error)
    }

    // 2. RESETING THE USER PASSWORD 
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetTokenExpire = undefined
    user.passwordChangedAt = Date.now();

    user.save();


    // 3.lOGIN THE USER 

     createSendResponse(user, 200,res);

   
})

