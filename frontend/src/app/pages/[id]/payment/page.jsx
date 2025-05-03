'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import apiClient from '@/app/utils/apiClient';
import { updateUser } from '@/app/redux/userSlice';

const createRazorpayOrder = async (amount) => {
  return {
    id: `order_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100,
    currency: 'INR',
  };
};

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [sdkError, setSdkError] = useState(false);

  const houseData = useSelector((state) => state?.house?.houses || []);
  const house = houseData?.find((house) => house._id === id);
  const date = useSelector((state) => state?.house?.filterData?.date || '');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!house) {
      alert('Invalid house ID. Redirecting to home page.');
      router.push('/');
    }
  }, [house, router]);

  const amount = parseInt(house?.price || 0);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay SDK loaded successfully');
    script.onerror = () => {
      setSdkError(true);
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (sdkError || !window.Razorpay) {
      alert('Razorpay SDK not loaded. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      const order = await createRazorpayOrder(amount);
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'House Booking',
        description: `Payment for ${house.title}`,
        order_id: order.id,
        handler: async (response) => {
          console.log('Payment successful:', response);
          const paymentData = {
            houseId: id,
            amount: order.amount,
            date: date,
            orderId: order.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          const res = await apiClient.post('/user/user/orderHouse', paymentData);
          if (res.success) {
            dispatch(updateUser(res.data.user));
          }

          router.push(`/home/${id}`);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.log('Payment modal closed');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Please try again.'}`);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!house) return null;

  return (
    <div className="min-h-screen mt-10 bg-gray-100 overflow-hidden">
      <header className="bg-white shadow-md p-4 fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/pages/${id}`}
            className="text-amber-600 hover:text-amber-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600 rounded"
            aria-label="Back to house details"
          >
            ← Back to House Details
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 pt-20 flex justify-center">
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            Payment for {house.title}
          </h1>
          <p className="text-xl md:text-2xl text-amber-600 font-semibold mb-6 text-center">
            Amount: ₹{amount.toLocaleString('en-IN')}
          </p>

          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">
              Select Payment Method
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Proceed with payment via Google Pay, PhonePe, Paytm, Card, or Netbanking.
            </p>
            {!date && (
              <p className="text-red-500 mb-4 text-center">
                Please select a date to proceed with payment.
              </p>
            )}
            <button
              onClick={handlePayment}
              disabled={loading || sdkError || !date}
              className={`w-full bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-600 ${
                loading || sdkError || !date ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Proceed to payment with selected method"
            >
              {loading ? 'Processing...' : sdkError ? 'SDK Error' : 'Pay Now'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
