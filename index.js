const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;
// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssi7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        // GET API
        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services);
        })

        // SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitt the post', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running genius server');
})
app.listen(port, () => {
    console.log('run genius', port);
})