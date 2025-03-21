'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TrendingProducts() {
  // Mock data
  const products = [
    {
      id: 1,
      name: 'Smart LED Bulbs',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1621909320555-3f2750e8bd8e',
    },
    {
      id: 2,
      name: 'Bluetooth Speaker',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    },
    {
      id: 3,
      name: 'Robot Vacuum',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1586170321137-6e8fcfb8b196',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <div className="relative h-40 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
          <p className="text-gray-900">${product.price}</p>
        </div>
      ))}
    </div>
  );
} 