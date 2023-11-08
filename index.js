const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ffet0a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const blogCollection = client.db('blogDB').collection('blog')
        const wishListCollection = client.db('blogDB').collection('wishList')

        //Add blog
        app.get('/addBlog', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/addBlog', async (req, res) => {
            const blogs = req.body;
            console.log(blogs);
            const result = await blogCollection.insertOne(blogs);
            res.send(result)
        })

        //wishList
        app.get('/wishList', async (req, res) => {
            const cursor = wishListCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/wishList', async (req, res) => {
            const wishlist = req.body;
            console.log(wishlist);
            const result = await wishListCollection.insertOne(wishlist);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Blog Universe is running')
})

app.listen(port, () => {
    console.log(`Blog Universe server is running on port ${port}`);
})