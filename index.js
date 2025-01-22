const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Connect to MongoDB

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const foodsCollection = client.db('food-flow').collection('foods');

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/foods', async (req, res) => {
  try {
    await client.connect();

    const foods = await foodsCollection.find({}).toArray();

    res.json(foods);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});
app.get('/foods/:id', async (req, res) => {
  try {
    await client.connect();

    const foodId = new ObjectId(req.params.id);

    const food = await foodsCollection.findOne({ _id: foodId });

    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.post('/foods', async (req, res) => {
  try {
    await client.connect();

    const newFood = req.body;

    const result = await foodsCollection.insertOne(newFood);

    res.json(result.ops[0]);
  } catch (error) {
    console.error('Error creating food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
