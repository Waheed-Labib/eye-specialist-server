const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const { MongoClient } = require("mongodb");
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

        app.get('/services', async (req, res) => {

            const limit = req.query.limit;

            const cursor = servicesCollection.find({});
            let result = await cursor.toArray();

            if (limit) result = result.splice(0, limit);
            res.send(result)
        })

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

app.get('/services', (req, res) => {
    res.send(services)
})

app.listen(port, () => {
    console.log('Eye Specialist Server running on port', port);
})