const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error ("Age must be a positve number")
            }
        }
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        uniqe:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error ("Email is invalid")
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minLength:6
    }
})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
        }
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User