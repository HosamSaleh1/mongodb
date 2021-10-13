const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

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
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
        }
    }
    ]
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
    console.log(isMatch)
    if(!isMatch){
       throw new Error ('Can not login, Wrong Email or Password')
    }
    return user
}

// JWT function
userSchema.methods.generateToken = async function(){
    const user = this
    const token = JWT.sign({_id:user._id.toString},'node course')
    user.tokens = user.tokens.concat({token})

    await user.save()

    return token
}



const User = mongoose.model('User',userSchema)

module.exports = User
