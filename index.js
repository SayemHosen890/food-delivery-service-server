const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT||5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjjoy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db("albinoWebsite");
        const servicesCollection = database.collection("services");
        const orderCollection = database.collection('orders')

        //get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })

        //get services single
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('single service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })

        //get api from order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orderFood = await cursor.toArray()
            res.send(orderFood);
        })

        //post api order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('order', order);
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)
        });

        //delete operation
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollection.deleteOne(query)
        //     res.json(result);
        // })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('running server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})