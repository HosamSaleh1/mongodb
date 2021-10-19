const {ObjectId} = require('bson')
const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middelware/auth')


// get all
router.get('/allTasks',auth,async (req,res)=>{
    try{
        await req.user.populate('tasks')
        if(!req.user.tasks){
            return "There is no tasks found"
        }
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send("Error :",e)
    }
})

// get by id
router.get('/allTasks/:id',auth,(req,res)=>{
    const _id = req.params.id
    Task.findOne({_id,owner:req.user._id})
    .then((task)=>{
    if(!task){
        return res.status(400).send('No task is found')
    }
    res.status(200).send(task)
})
    .catch((e)=>{
        res.status(400).send(e)
    })
})

// post task
router.post('/addTask',auth,(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    task.save()
    .then(()=>{
        res.status(200).send(task)
    })
    .catch((e)=>{
        res.status(400).send(e)
    })
})

// update task
router.patch('/updateTask/:id',auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Can not update')
    }
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('Task Not Found')
        }
        updates.forEach((update)=>task[update]=req.body[update],{new:true})
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send('Error :',e)
    }
})

// delete task
router.delete('/deleteTask/:id',auth, async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(400).send('No task found')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send('Error :',e)
    }
})

module.exports = router