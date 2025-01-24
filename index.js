const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongoDB();

const foodsCollection = client.db('food-flow').collection('foods');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/foods', async (req, res) => {
  try {
    const foods = await foodsCollection.find({}).toArray();
    res.json(foods);
  } catch (error) {
    console.error('Error fetching all food items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/foods/:id', async (req, res) => {
  try {
    const foodId = new ObjectId(req.params.id);

    const food = await foodsCollection.findOne({ _id: foodId });

    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/foods', async (req, res) => {
  try {
    const newFood = req.body;

    const result = await foodsCollection.insertOne(newFood);
    res.json(result.ops[0]);
  } catch (error) {
    console.error('Error creating food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/foods/:id', async (req, res) => {
  try {
    const foodId = new ObjectId(req.params.id);
    const updatedFood = req.body;

    delete updatedFood._id;

    const result = await foodsCollection.updateOne(
      { _id: foodId },
      { $set: updatedFood }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json({ message: 'Food item updated successfully' });
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/foods/:id', async (req, res) => {
  try {
    const foodId = new ObjectId(req.params.id);

    const result = await foodsCollection.deleteOne({ _id: foodId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/foods/email/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const foods = await foodsCollection
      .find({
        'donator.email': email,
      })
      .toArray();

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ error: 'No food items found for this email' });
    }

    res.json(foods);
  } catch (error) {
    console.error('Error fetching food items by email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/foods/requested/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const foods = await foodsCollection
      .find({
        requestedEmail: email,
      })
      .toArray();

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ error: 'No food items found for this email' });
    }

    res.json(foods);
  } catch (error) {
    console.error('Error fetching food items by email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
