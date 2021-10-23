const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// user:mydbuser1
// password:6D9C4CezYvd6EcV0

const uri = "mongodb+srv://mydbuser1:6D9C4CezYvd6EcV0@cluster0.qe1gc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodmaster");
      const usersCollection = database.collection("users");
      
      // get api 
      app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users)
      });

      // update api
      app.get('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const user = await usersCollection.findOne(query);
        console.log('load data with id',id);
        res.json(user)
      })

      // post api
      app.post('/users',async (req,res) =>{
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        console.log('got a user',req.body);
        console.log(result);
        res.json(result)
      });

      // delete api
      app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        console.log('deleting users with id',result);
        res.json(result)
      })
      
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running my crud server');
})
app.listen(port,()=>{
    console.log('Running server on port',port);
})