# Mini E-commerce Platform

A modern, full-stack e-commerce application built with React, Express.js, and MySQL. This project demonstrates a complete shopping experience with product listings, cart management, and checkout functionality.

## 🚀 Features

- **Product Management**
  - Browse products with pagination
  - Detailed product views
  - Stock tracking
- **Shopping Cart**
  - Add/remove items
  - Adjust quantities
  - Persistent cart data
  - Real-time total calculation
- **Checkout Process**
  - Multi-step form
  - Address collection
  - Payment processing
  - Order confirmation
- **Responsive Design**
  - Mobile-friendly interface
  - Modern UI with Tailwind CSS
  - Smooth animations

## 📁 Project Structure

```
mini-ecommerce/
├── public/
│   └── vite.svg
├── server/
│   └── index.js           # Express server & database configuration
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Pagination.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── ProductDetail.jsx
│   │   └── ProductList.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.tsx
├── .env
├── .eslintrc.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.ts
```

## 🛠 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## ⚙️ Environment Setup

1. Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=ecommerce
```

2. Create MySQL database:

```sql
CREATE DATABASE ecommerce;
```

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mini-ecommerce
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
# Start backend server
npm run server

# In a new terminal, start frontend development server
npm run dev
```

## 🗄️ Database Models

### Products Table
```sql
CREATE TABLE Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  imageUrl VARCHAR(255),
  stock INT DEFAULT 0
);
```

### Orders Table
```sql
CREATE TABLE Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userID INT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered') DEFAULT 'pending',
  shippingAddress TEXT NOT NULL,
  paymentMethod VARCHAR(255) NOT NULL
);
```

### OrderItems Table
```sql
CREATE TABLE OrderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  OrderId INT,
  ProductId INT,
  quantity INT,
  subTotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (OrderId) REFERENCES Orders(id),
  FOREIGN KEY (ProductId) REFERENCES Products(id)
);
```

## 🔧 Configuration

### Backend Configuration (server/index.js)
- Express.js server setup
- MySQL connection using Sequelize
- API endpoints for products and orders
- Sample data seeding

### Frontend Configuration
- Vite for development and building
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling

## 🚀 Available Scripts

- `npm run dev`: Start frontend development server
- `npm run server`: Start backend server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 💡 Common Issues & Solutions

1. **Database Connection Issues**
   > Error: "SequelizeConnectionError"
   - Check if MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Missing Dependencies**
   > Error: "Module not found"
   - Run `npm install` to install all dependencies
   - Clear npm cache: `npm cache clean --force`

3. **Port Already in Use**
   > Error: "EADDRINUSE"
   - Change port in `.env` file
   - Kill process using the port: `lsof -i :3000`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Sequelize Documentation](https://sequelize.org)
- [Tailwind CSS](https://tailwindcss.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.