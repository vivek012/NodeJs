const User = require('./../Models/usermodel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError')
const util = require('util');
const sendEmail = require('./../Utils/email')
const crypto = require('crypto')
const authController = require('./../Controllers/authController')


const filterReqObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop))
            newObj[prop] = obj[prop]
    
    })

    return newObj;
}



exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    // GET CURRENT USER DATA FROM DATABASE
    const user = await User.findById(req.user._id).select('+password');

    // CHECK IF THE SUPPLIED CURRENT pASSWORD IS CORRECT
    if (!await user.comparePasswordInDb(req.body.currentPassword, user.password)) {
        return next(new CustomError('The current password you provided is wrong', 401))
    }
    //IF SUPPLIED PASSWORD IS CORRECT ,  UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //  LOGIN USER & SEND JWT

    authController.createSendResponse(user, 200,res);
    
})

exports.updateMe = asyncErrorHandler( async (req, res , next)=>{
    // 1. CHECK IF REQUEST DATA CONTAIN PASSWORD || CONFIRM PASSWORD
    if(req.body.password || req.body.confirmPassword){
        return next( new CustomError('You cannot update your password using this endpoint', 400))
    }

    // UPDATE USER DETAIL 
    const filterObj = filterReqObj(req.body, 'name', 'email')
    const upadateUser = await User.findByIdAndUpdate(req.user._id, filterObj, {runValidators: true, new: true})
   
    authController.createSendResponse(upadateUser, 200,res);
   
});