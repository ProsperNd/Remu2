'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';

// Mock deal data - in a real app, this would come from an API
const deal = {
  id: 101,
  name: 'Premium Wireless Noise Cancelling Headphones',
  href: '/products/premium-headphones',
  price: 129.99,
  originalPrice: 349.99,
  discountPercentage: 63,
  imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  imageAlt: 'Premium Wireless Noise Cancelling Headphones',
  rating: 4.9,
  reviewCount: 587,
  freeShipping: true,
  description: 'Experience immersive sound quality with these premium wireless headphones featuring active noise cancellation, comfortable over-ear design, and up to 30 hours of battery life.',
  features: [
    'Active Noise Cancellation',
    'Bluetooth 5.0 connectivity',
    '30-hour battery life',
    'Premium comfort with memory foam ear cushions',
    'Built-in microphone for calls',
    'Foldable design for easy storage',
  ],
  endTime: new Date().setHours(new Date().getHours() + 23, 59, 59, 999), // Deal ends in 24 hours
};

const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deal.endTime - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 lg:aspect-auto lg:h-full">
          <Image
            src={deal.imageSrc}
            alt={deal.imageAlt}
            fill
            className="object-cover object-center"
          />
          <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
            {deal.discountPercentage}% OFF
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 lg:p-8">
          {/* Deal countdown */}
          <div className="mb-4 rounded-lg bg-gray-100 p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Deal ends in:</p>
            <div className="flex space-x-3">
              <div className="flex-1 rounded-md bg-white p-2 text-center">
                <span className="block text-lg font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500">Hours</span>
              </div>
              <div className="flex-1 rounded-md bg-white p-2 text-center">
                <span className="block text-lg font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500">Minutes</span>
              </div>
              <div className="flex-1 rounded-md bg-white p-2 text-center">
                <span className="block text-lg font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500">Seconds</span>
              </div>
            </div>
          </div>

          {/* Product details */}
          <h2 className="text-2xl font-bold text-gray-900">{deal.name}</h2>
          
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`h-5 w-5 flex-shrink-0 ${
                    deal.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">({deal.reviewCount} reviews)</p>
          </div>

          <div className="mt-4 flex items-end">
            <p className="text-3xl font-bold text-gray-900">${deal.price.toFixed(2)}</p>
            <p className="ml-2 text-lg text-gray-500 line-through">${deal.originalPrice.toFixed(2)}</p>
          </div>

          {deal.freeShipping && (
            <p className="mt-2 text-sm font-medium text-green-600">Free Shipping</p>
          )}

          <p className="mt-4 text-sm text-gray-600">{deal.description}</p>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Features:</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {deal.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href={deal.href}
              className="flex-1 rounded-md bg-primary-600 px-4 py-3 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              View Deal
            </Link>
            <button
              type="button"
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealOfTheDay; 