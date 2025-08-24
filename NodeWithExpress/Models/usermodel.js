const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Enter The name']
    },
    email:{
        type: String,
        required: [true, 'Please Enter The email'],
        unique: true,
        lowercase: true,
        validator : [validator.isEmail, 'Please Enter a Valid name'] 

    },
    photo: String,
    password:{
        type: String,
        required: [true, 'Please Enter The password'],
        minlength: 8
    },
    confirmPassword:{
        type: String,
        required: [true, 'Please Enter The name']
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;