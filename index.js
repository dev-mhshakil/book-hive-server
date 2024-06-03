const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = 5000;

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://mhshakil:mhshakil24@cluster0.86wsn7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const bookHiveDB = client.db("BookHiveDB");
    const userCollection = bookHiveDB.collection("userCollection");
    const booksCollection = bookHiveDB.collection("booksCollection");
    const categoriesCollection = bookHiveDB.collection("categoriesCollection");

    //book
    app.get("/books", async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find().toArray();
      res.send(result);
    });

    app.post("/books", async (req, res) => {
      const bookData = req.body;
      const result = await booksCollection.insertOne({ bookData });
      res.send(result);
    });

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.patch("/books/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const result = await booksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { data } },
        { upsert: true }
      );
      res.send(result);
    });

    //user

    app.post("/user", async (req, res) => {
      const data = req.body;
      const user = {
        email: data.email,
        name: data.name,
      };

      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
