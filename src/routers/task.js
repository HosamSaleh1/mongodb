const {ObjectId} = require('bson')
const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

// get all
router.get('/allTasks',(req,res)=>{
    Task.find({})
    .then((task)=>{
        res.status(200).send(task)
    })
    .catch((e)=> {
        res.status(500).send(e)
    })
})

// get by id
router.get('/allTasks/:id',(req,res)=>{
    const _id = req.params.id
    Task.findById(_id)
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
router.post('/addTask',(req,res)=>{
    const task = new Task(req.body)
    task.save()
    .then(()=>{
        res.status(200).send(task)
    })
    .catch((e)=>{
        res.status(400).send(e)
    })
})

// update task
router.patch('/updateTask/:id', async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Can not update')
    }
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndUpdate(_id,req.body,{new:true})
        if(!task){
            return res.status(404).send('Task Not Found')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// delete task
router.delete('/deleteTask/:id', async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if(!task){
            return res.status(400).send('No task found')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router