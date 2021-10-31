const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
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
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error ("Email is invalid")
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
        }
    }
    ],
 
        
        avatar:{
        type:Buffer
        }
    

})

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
        }
    next()
})

// login function
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error ('Can not login, Wrong Email or Password')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
       throw new Error ('Can not login, Wrong Email or Password')
    }
    return user
}

// JWT function
userSchema.methods.generateToken = async function(){
    const user = this
    const token = JWT.sign({_id:user._id.toString()},process.env.JWT_SECRET, {expiresIn:'7 days'})
    user.tokens = user.tokens.concat({token})

    await user.save()

    return token
}

// Relations
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

// to object function
userSchema.methods.toJSON = function(){
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

const User = mongoose.model('User',userSchema)

module.exports = User
