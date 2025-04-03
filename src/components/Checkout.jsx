import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const CheckoutForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { cart, calculateTotals, clearCart } = useCart();
  const { total } = calculateTotals();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      address: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      postalCode: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      cardNumber: Yup.string().required('Required').matches(/^\d{16}$/, 'Invalid card number'),
      cardExpiry: Yup.string().required('Required').matches(/^\d{2}\/\d{2}$/, 'Invalid expiry date'),
      cardCVC: Yup.string().required('Required').matches(/^\d{3}$/, 'Invalid CVC')
    }),
    onSubmit: async (values) => {
      console.log('Submitting order:', values);
      try {
        setLoading(true);
        setError(null);

        const orderData = {
          items: cart,
          total,
          shippingAddress: `${values.address}, ${values.city}, ${values.postalCode}, ${values.country}`,
          paymentMethod: 'credit_card'
        };
        console.log('Order data:', orderData);

        await axios.post('http://localhost:5000/api/orders', orderData);
        clearCart();
        navigate('/');
      } catch (error) {
        setError('Failed to process order. Please try again.'.error);
      } finally {
        setLoading(false);
      }
    }
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...formik.getFieldProps('firstName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  {...formik.getFieldProps('lastName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                {...formik.getFieldProps('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                {...formik.getFieldProps('address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...formik.getFieldProps('city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                {...formik.getFieldProps('postalCode')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.postalCode && formik.errors.postalCode && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.postalCode}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...formik.getFieldProps('country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.country && formik.errors.country && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                {...formik.getFieldProps('cardNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.cardNumber}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
              <input
                type="text"
                {...formik.getFieldProps('cardExpiry')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.cardExpiry && formik.errors.cardExpiry && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.cardExpiry}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <input
                type="text"
                {...formik.getFieldProps('cardCVC')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {formik.touched.cardCVC && formik.errors.cardCVC && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.cardCVC}</div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}
        
        <div className="flex justify-between mb-8">
          <div className={`flex-1 text-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            Shipping
          </div>
          <div className={`flex-1 text-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            Payment
          </div>
          <div className={`flex-1 text-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            Review
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
