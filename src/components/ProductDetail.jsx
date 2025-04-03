import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorMessage from './common/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setQuantity(1);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-2xl font-bold text-indigo-600 mt-4">${product.price}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;