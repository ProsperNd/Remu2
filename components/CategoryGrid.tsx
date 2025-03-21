'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - in a real app, this would come from an API
const categories = [
  {
    id: 1,
    name: 'Electronics',
    href: '/products?category=electronics',
    imageSrc: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    imageAlt: 'Electronics category',
  },
  {
    id: 2,
    name: 'Home & Kitchen',
    href: '/products?category=home-kitchen',
    imageSrc: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
    imageAlt: 'Home and Kitchen category',
  },
  {
    id: 3,
    name: 'Fashion',
    href: '/products?category=fashion',
    imageSrc: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    imageAlt: 'Fashion category',
  },
  {
    id: 4,
    name: 'Beauty',
    href: '/products?category=beauty',
    imageSrc: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    imageAlt: 'Beauty category',
  },
  {
    id: 5,
    name: 'Toys & Games',
    href: '/products?category=toys-games',
    imageSrc: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80',
    imageAlt: 'Toys and Games category',
  },
  {
    id: 6,
    name: 'Sports & Outdoors',
    href: '/products?category=sports-outdoors',
    imageSrc: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    imageAlt: 'Sports and Outdoors category',
  },
];

const CategoryGrid = () => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={category.href}
          className="group relative rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <div className="relative h-full w-full object-cover object-center">
              <Image
                src={category.imageSrc}
                alt={category.imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-base font-medium text-white">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid; 