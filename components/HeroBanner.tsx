'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-900">
      {/* Hero image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-75" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full overflow-hidden">
            <div className="relative h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Hero image of shopping products"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Shop Smarter.</span>
          <span className="block text-primary-400">Save Bigger.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-300">
          Discover amazing deals on thousands of products with prices that make sense. Quality shopping that doesn't break the bank.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link 
            href="/products" 
            className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Shop Now
          </Link>
          <Link 
            href="/categories" 
            className="text-base font-semibold leading-7 text-white"
          >
            Browse Categories <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 