const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('Cluster0');  // Use 'Cluster0' as your database name
      const collection = database.collection('appointments');

      const { name, email, phone } = req.body;
      const doc = { name, email, phone, createdAt: new Date() };
      await collection.insertOne(doc);

      res.status(200).json({ message: 'Appointment scheduled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to schedule appointment' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
