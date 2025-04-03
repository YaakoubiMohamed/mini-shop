import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">MiniShop</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Products</Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;