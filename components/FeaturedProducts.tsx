'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';

// Mock data - in a real app, this would come from an API
const products = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    href: '/products/wireless-earbuds',
    price: 39.99,
    originalPrice: 79.99,
    discountPercentage: 50,
    imageSrc: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    imageAlt: 'Wireless Earbuds',
    rating: 4.5,
    reviewCount: 127,
    freeShipping: true,
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    href: '/products/smart-watch',
    price: 149.99,
    originalPrice: 249.99,
    discountPercentage: 40,
    imageSrc: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    imageAlt: 'Smart Watch Series 5',
    rating: 4.8,
    reviewCount: 325,
    freeShipping: true,
  },
  {
    id: 3,
    name: 'Home Security Camera',
    href: '/products/security-camera',
    price: 59.99,
    originalPrice: 99.99,
    discountPercentage: 40,
    imageSrc: 'https://images.unsplash.com/photo-1585771724684-38269d6914fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    imageAlt: 'Home Security Camera',
    rating: 4.2,
    reviewCount: 83,
    freeShipping: false,
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    href: '/products/water-bottle',
    price: 24.99,
    originalPrice: 34.99,
    discountPercentage: 29,
    imageSrc: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
    imageAlt: 'Stainless Steel Water Bottle',
    rating: 4.6,
    reviewCount: 219,
    freeShipping: true,
  },
];

const FeaturedProducts = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <div key={product.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
          {product.discountPercentage > 0 && (
            <div className="absolute left-0 top-0 z-10 rounded-br-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
              {product.discountPercentage}% OFF
            </div>
          )}
          
          <div className="aspect-square overflow-hidden bg-gray-100 group-hover:opacity-75">
            <div className="relative h-full w-full">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <Link href={product.href}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </Link>
            </h3>
            
            <div className="mt-1 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-4 w-4 flex-shrink-0 ${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-1 text-xs text-gray-500">({product.reviewCount})</p>
            </div>
            
            <div className="mt-2 flex justify-between">
              <div>
                <p className="text-base font-medium text-gray-900">${product.price.toFixed(2)}</p>
                {product.originalPrice > product.price && (
                  <p className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
              </div>
              {product.freeShipping && (
                <p className="text-xs text-green-600">Free Shipping</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts; 