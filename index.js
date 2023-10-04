const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

app.use(cors())
app.use(express.json())

// mongodb configuration 
const uri = process.env.mongodb_uri;
const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db("drBean");
        const servicesCollection = database.collection("services");

        // read all services from database
        app.get('/services', async (req, res) => {

            const limit = req.query.limit;

            const cursor = servicesCollection.find({});
            let result = await cursor.toArray();

            if (limit) result = result.splice(0, limit);
            res.send(result)
        })

        // read particular service from database
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const serviceId = new ObjectId(id);

            const query = { _id: serviceId };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        // create new service on database
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

    } finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Eye Specialist Server runing');
})

app.listen(port, () => {
    console.log('Eye Specialist Server running on port', port);
})