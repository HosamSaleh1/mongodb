const { ObjectId } = require('bson')
const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// get all
router.get('/users',(req,res)=>{
    User.find({})
    .then((user)=>{
        res.status(200).send(user)
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
})

// get by ID
router.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(400).send('Unable to find any user with this ID')
        }
        res.status(200).send(user)
        .catch((e)=>{
            res.status(500).send(e)
            console.log(e.status , e)
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
router.patch('/users/:id',async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','password']
    const isValied = updates.every((update)=> allowedUpdates.includes(update))
        if (!isValied){
            return res.status(400).send('Can not update')
        }
        const _id = req.params.id
    try{
        const user = await User.findById(_id)
        console.log(user)
        updates.forEach((update)=> (user[update] = req.body[update]))
        await user.save()
        console.log(user)
        res.status(200).send(user)
    }catch(e){
        res.status(400).send("Error has Occured " + e)
    }
})


// Delete by ID
router.delete('/users/:id',async(req,res)=>{
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
router.post('/user',(req,res)=>{
    console.log("test")
    const user = new User(req.body)
    user.save().then(()=>{
        res.status(200).send(user)
    }).catch((err)=>{
        res.status(400).send('Error has occurred ' + err)
    })
})










module.exports = router