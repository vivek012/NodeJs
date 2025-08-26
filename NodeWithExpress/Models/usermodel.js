const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')


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
        validate : [validator.isEmail, 'Please Enter a Valid name'] 

    },
    photo: String,
    password:{
        type: String,
        required: [true, 'Please Enter The password'],
        minlength: 8
    },
    confirmPassword:{
        type: String,
        required: [true, 'Please Enter The name'],
        validate:{
            validator: function(val){
               return val ==this.password
            },
            message: 'Password & Confirm Password does not match'
        }
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    // encrypt the password before saving it
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;