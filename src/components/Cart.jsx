import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotals } = useCart();
  const { subtotal, tax, total } = calculateTotals();
console.log(cart);
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center p-4 border-b">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="text-gray-600 hover:text-indigo-600"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <span className="text-gray-800 w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                className="text-gray-600 hover:text-indigo-600"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="ml-4 text-right">
              <p className="text-lg font-semibold text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <Link
            to="/"
            className="flex-1 px-6 py-3 text-center text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/checkout"
            className="flex-1 px-6 py-3 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;