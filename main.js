const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const app = express();
app.use(express.json());

// 1. Dynamic Port Configuration from your .env
const PORT = process.env.PORT ;

// 2. Extract DB Strings from your exact key names
// Falls back to direct string if process.env fails to read the file
const CLOUD_DB = process.env.atlasport ;
const LOCAL_DB = process.env.dbport ;

// Note: Right now it connects to Cloud Atlas. Swap with LOCAL_DB if you want local testing.
const CONNECTION_URI = CLOUD_DB; 

// 3. Establish Safe Connection
mongoose.connect(CONNECTION_URI)
  .then(() => {
    const dbType = CONNECTION_URI === CLOUD_DB ? "MongoDB Atlas Cloud" : "Local MongoDB";
    console.log(`✅ Connected to ${dbType} Successfully!`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// 4. Mongoose Schema Setup with Optimized Compound Index
const OrderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

// Indexing for faster aggregation pipeline sorting and filtering
OrderSchema.index({ category: 1, orderDate: -1 });

const Order = mongoose.model('Order', OrderSchema);

// 5. API Endpoint to Inject Seed/Dummy Data
app.post('/api/seed', async (req, res) => {
  try {
    await Order.deleteMany({}); 
    const dummyOrders = [
      { productName: 'Laptop', category: 'Electronics', price: 80000, quantity: 2 },
      { productName: 'Smartphone', category: 'Electronics', price: 30000, quantity: 5 },
      { productName: 'T-Shirt', category: 'Clothing', price: 1500, quantity: 10 },
      { productName: 'Jeans', category: 'Clothing', price: 2500, quantity: 4 },
      { productName: 'Coffee Maker', category: 'Home Appliances', price: 5000, quantity: 3 }
    ];
    await Order.insertMany(dummyOrders);
    res.status(201).json({ success: true, message: 'Dummy data inserted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Practical Challenge Core: Sales Analytics Aggregation Dashboard
app.get('/api/analytics', async (req, res) => {
  try {
    const report = await Order.aggregate([
      // Stage 1: Filter valid prices using the indexed field
      { $match: { price: { $gt: 0 } } },
      
      // Stage 2: Group data by category & run advanced data analytics calculations
      {
        $group: {
          _id: '$category',
          totalSalesAmount: { $sum: { $multiply: ['$price', '$quantity'] } },
          totalItemsSold: { $sum: '$quantity' },
          averageProductPrice: { $avg: '$price' }
        }
      },
      
      // Stage 3: Sort resulting documents by revenue in descending manner
      { $sort: { totalSalesAmount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      repoId: "fsd-sn-73-aggregation_Indexing",
      message: "Sales Analytics Dashboard Report Generated",
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Application Server
app.listen(PORT, () => {
  console.log(`🚀 Server actively running on port ${PORT}`);
});
