const mongoose = require('mongoose')

const User = mongoose.model('User',{
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

module.exports = User