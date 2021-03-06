const { ObjectId } = require('bson')
const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middelware/auth')
// image upload
const multer = require('multer')

const upload = multer({
    limits:{
        fieldSize: 100000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
            cb(new Error('Please upload an image file'))
        }
        cb(null,true)
    }
})

router.post('/profile/avatar',auth,upload.single('avatar'),async (req,res)=>{
    try{
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.send('Image Uploaded')
    }
    catch(e){
        res.send(e)
    }
})

// get all
router.get('/allUsers',auth,(req,res)=>{
    User.find({})
    .then((user)=>{
        res.status(200).send(user)
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
})

// get profile
router.get('/profile',auth,(req,res)=>{
    User.findById(req.user._id)
    .then((user)=>{
        res.status(200).send(user)
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
})

// get by ID
router.get('/allUsers/:id',auth,(req,res)=>{
    const _id = req.params.id
    User.findById(_id)
    .then((user)=>{
        if(!user){
            return res.status(400).send('Unable to find any user with this ID')
        }
        res.status(200).send(user)
    .catch((e)=>{
            res.status(500).send(e)
        })
    })
})

// update version 1
// router.patch('/users/:id',async(req,res)=>{
    
//     const updates = Object.keys(req.body)

//     const allowedUpdates = ["name","age"]

//     const isValied = updates.every((update)=> allowedUpdates.includes(update))

//     if(!isValied){
//         return res.status(400).send('Can not update')
//     }
//     const _id = req.params.id
//     try{
//         const user = await User.findByIdAndUpdate(_id,req.body,{
//         new:true,
//         runValidators:true
//         })
//         if(!user){
//             return res.status(404).send('No User is found')
//         }
//         res.status(200).send(user)
//     }
//     catch{(e)=>{
//             res.status(500).send('Error has Occured' + e)
//     }}
   
// })

// update version 2 (to hash the password)
router.patch('/updateUser/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','password']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))
        if (!isValid){
            return res.status(400).send('Can not update')
        }
        const _id = req.params.id
    try{
        const user = await User.findById(_id)
        updates.forEach((update)=> (user[update] = req.body[update]))
        await user.save()
        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


// Delete by ID
router.delete('/deleteUser/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send('User Not Found')
        }
        res.status(200).send(user)
    }
        catch(e){
            res.status(400).send(e)
        }
    })


// post user data
router.post('/addUser', async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(err){
        res.status(400).send(err)
    }
})

// login
router.post('/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(500).send(e)
    }
})

// logout
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el.token !== req.token
        })
        await req.user.save()
        res.status(200).send('Logout Successfuly')
    }
    catch(e){
        res.status(400).send(e)
    }
})

// logout All
router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Logout From All Devices')
    }
    catch(e){
        res.status(400).send(e)
    }
})







module.exports = router
