import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize('ecommerce', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Models
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(['pending', 'paid', 'shipped', 'delivered']),
    allowNull: false,
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
});

// Relationships
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);
Product.hasMany(OrderItem);

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    console.log("Received order data:", req.body); // Log the received data

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required and should be an array." });
    }
    if (!total || typeof total !== 'number') {
      return res.status(400).json({ error: "Total amount is required and should be a number." });
    }
    if (!shippingAddress || typeof shippingAddress !== 'string') {
      return res.status(400).json({ error: "Shipping address is required and should be a string." });
    }
    if (!paymentMethod || paymentMethod !== 'credit_card') {
      return res.status(400).json({ error: "Payment method is required and should be 'credit_card'." });
    }

    const order = await Order.create({
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    const orderItems = await Promise.all(
      items.map(item => 
        OrderItem.create({
          OrderId: order.id,
          ProductId: item.id,
          quantity: item.quantity,
          subTotal: item.price * item.quantity
        })
      )
    );

    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error("Error processing order:", error); // Log the full error
    res.status(400).json({ error: error.message });
  }
});


// Initialize database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }).then(async () => {
  // Add some sample products
  await Product.bulkCreate([
    {
      name: "Wireless Headphones",
      price: 99.99,
      description: "High-quality wireless headphones with noise cancellation",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      stock: 50
    },
    {
      name: "Smart Watch",
      price: 199.99,
      description: "Feature-rich smartwatch with health tracking",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      stock: 30
    },
    {
      name: "Laptop",
      price: 999.99,
      description: "Powerful laptop for work and entertainment",
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      stock: 20
    }
  ]);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});