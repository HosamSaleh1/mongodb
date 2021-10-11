const mongodb = require('mongodb')

const mongoClient = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'

const dbName = "taskManger"

const _id = new mongodb.ObjectId

mongoClient.connect(connectionUrl,{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log(err)
    }
    console.log('Success')
    
    const db = client.db(dbName)
    
    // db.collection('users').find({age:34}).count((err,data)=>{
    //     if(err){
    //         return console.log(err)
    //     }
    //     console.log(data)
    //     client.close()
    // })
    // db.collection('users').updateOne({age:34},{
    //     $set: {name:'Hosam Saleh'}
    // }).then((res)=>console.log(res.modifiedCount))
    // .catch((err)=>console.log(err))
   
    // db.collection('tasks').updateMany({},{
    //     $set:{completed:true}
    // }).then((res)=>console.log(res.matchedCount))
    // .catch((err)=>console.log(err))
    db.collection('users').deleteMany({})
    .then((res)=>console.log(res.deletedCount))
    .catch((err)=>console.log(err))
})




// mongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
//     if(error){
//         return console.log(error)
//     }
//     console.log('success')

//     const db = client.db(dbName)

//     // db.collection('users').insertOne({
//     //     name:'Hosam',
//     //     age:34
//     // })
//     // db.collection('tasks').insertOne({
//     //     description:'Task1',
//     //     completed: false
//     // })
    
//     db.collection('users').insertMany([
//         {name:'hosam',age:34},
//         {name:'yaser',age:23},
//         {name:'adam',age:39}
//     ]),(error,result)=>{
//         if(error){
//             console.log(error)
//         }else{
//             console.log(result.obs)
//         }
//     }

//     db.collection('tasks').insertMany([
//         {description:'task1',completed:false},
//         {description:'task2',completed:true},
//         {description:'task3',completed:false}
//     ]),(error,data)=>{
//         if(error){
//         console.log(error)
//     }else{
//         console.log(data.insertedCount)
//     }
//     }
// })


