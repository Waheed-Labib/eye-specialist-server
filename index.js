const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

app.use(cors())
app.use(express.json())

// mongodb configuration 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbmbmyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ message: 'Unauthorized Access.' })


    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized Access' })

        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const database = client.db("drBean");
        const servicesCollection = database.collection("services");
        const reviewsCollection = database.collection('reviews');

        // jwt
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ token })
        })

        // read all services from database
        app.get('/services', async (req, res) => {

            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = servicesCollection.find(query);

            const count = await servicesCollection.estimatedDocumentCount();
            const services = await cursor.skip(page * size).limit(size).toArray();

            res.send({ count, services });
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

        // read all reviews from database
        app.get('/reviews', async (req, res) => {

            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // create review on database
        app.post('/reviews', async (req, res) => {

            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        // get reviews for particular service
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };

            const cursor = reviewsCollection.find(query);

            let result = await cursor.toArray();

            // the array is reversed to send the newest review first
            result = result.slice().reverse();

            res.send(result)
        })

        // update rating on particular service details
        app.put('/services/:id', async (req, res) => {
            const service = req.body;

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }

            const options = { upsert: true }
            const updatedService = {
                $set: {
                    name: service.name,
                    price: service.price,
                    description: service.description,
                    image: service.image,
                    rating: service.rating,
                    ratingCount: service.ratingCount
                }
            }

            const result = await servicesCollection.updateOne(filter, updatedService, options)
            res.send(result)
        })

        // read reviews added by a particular user
        app.get('/user-reviews/:id', verifyJWT, async (req, res) => {

            const decoded = req.decoded;
            if (decoded.uid !== req.params.id) {
                return res.status(403).send('Forbidden Access')
            }

            const id = req.params.id;
            const query = { userId: id };

            const cursor = reviewsCollection.find(query);

            let result = await cursor.toArray();

            // the array is reversed to send the newest review first
            result = result.slice().reverse();

            res.send(result);
        })

        // update particular review

        app.put('/reviews/:id', async (req, res) => {

            const review = req.body;

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updatedReview = {
                $set: {
                    userId: review.userId,
                    userName: review.userName,
                    userImage: review.userImage,
                    serviceId: review.serviceId,
                    serviceName: review.serviceName,
                    rating: review.rating,
                    review: review.review,
                }
            }

            const result = await reviewsCollection.updateOne(filter, updatedReview, options);
            res.send(result);

        })

        // delete a review 

        app.delete('/reviews/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const result = await reviewsCollection.deleteOne(filter);
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


