'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Mock product data - in a real app, this would come from an API
const product = {
  id: 'wireless-earbuds',
  name: 'Wireless Earbuds Pro',
  description: 'Experience immersive sound with these premium wireless earbuds featuring active noise cancellation, water resistance, and up to 24 hours of battery life with the charging case.',
  price: 39.99,
  originalPrice: 79.99,
  discountPercentage: 50,
  rating: 4.5,
  reviewCount: 127,
  inStock: true,
  freeShipping: true,
  images: [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Wireless Earbuds - Front view',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80',
      alt: 'Wireless Earbuds - In charging case',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
      alt: 'Wireless Earbuds - Side view',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1627734819947-ba884aea7e98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      alt: 'Wireless Earbuds - In ear',
    },
  ],
  colors: [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Blue', value: '#3B82F6' },
  ],
  features: [
    'Active Noise Cancellation',
    'Bluetooth 5.0 connectivity',
    'Up to 8 hours of listening time (24 hours with charging case)',
    'Sweat and water resistant (IPX4)',
    'Customizable touch controls',
    'Built-in microphone for calls',
    'Wireless charging compatible',
  ],
  details: [
    { name: 'Battery Life', value: 'Up to 8 hours (24 hours with case)' },
    { name: 'Connectivity', value: 'Bluetooth 5.0' },
    { name: 'Water Resistance', value: 'IPX4' },
    { name: 'Noise Cancellation', value: 'Active' },
    { name: 'Charging', value: 'USB-C and Wireless' },
    { name: 'Warranty', value: '1 Year Limited' },
  ],
  relatedProducts: [
    {
      id: 'smart-watch',
      name: 'Smart Watch Series 5',
      href: '/products/smart-watch',
      price: 149.99,
      imageSrc: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
      imageAlt: 'Smart Watch Series 5',
    },
    {
      id: 'security-camera',
      name: 'Home Security Camera',
      href: '/products/security-camera',
      price: 59.99,
      imageSrc: 'https://images.unsplash.com/photo-1585771724684-38269d6914fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      imageAlt: 'Home Security Camera',
    },
    {
      id: 'water-bottle',
      name: 'Stainless Steel Water Bottle',
      href: '/products/water-bottle',
      price: 24.99,
      imageSrc: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
      imageAlt: 'Stainless Steel Water Bottle',
    },
  ],
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };
  
  const handleBuyNow = () => {
    // In a real app, this would add to cart and redirect to checkout
    toast.success('Redirecting to checkout...');
  };
  
  const handleAddToWishlist = () => {
    // In a real app, this would add the product to the wishlist
    toast.success(`Added ${product.name} to wishlist!`);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-start">
            <div className="aspect-square overflow-hidden rounded-lg">
              <div className="relative h-full w-full">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
            
            {/* Image gallery */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className={`relative aspect-square overflow-hidden rounded-lg ${
                    selectedImage.id === image.id
                      ? 'ring-2 ring-primary-500'
                      : 'hover:opacity-75'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0">
            {product.discountPercentage > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {product.discountPercentage}% OFF
              </span>
            )}
            
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.rating > rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">({product.reviewCount} reviews)</p>
              <span className="mx-2 text-gray-400">•</span>
              <p className="text-sm text-gray-500">
                {product.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                {product.originalPrice > product.price && (
                  <p className="ml-2 text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {product.freeShipping && (
                <p className="mt-1 text-sm font-medium text-green-600">Free Shipping</p>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-500">{product.description}</p>
            </div>
            
            {/* Color selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="mt-2 flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                      selectedColor.name === color.name
                        ? 'ring-2 ring-primary-500 ring-offset-2'
                        : ''
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <span
                      className="rounded-full h-6 w-6 border border-gray-200"
                      style={{ backgroundColor: color.value }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={!product.inStock}
                >
                  <span className="sr-only">Decrease quantity</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  type="number"
                  className="h-10 w-16 border-t border-b border-gray-300 text-center text-sm"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      setQuantity(value);
                    }
                  }}
                  min="1"
                  disabled={!product.inStock}
                />
                <button
                  type="button"
                  className="rounded-r-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <span className="sr-only">Increase quantity</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Add to cart and Buy now buttons */}
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                className="flex-1 bg-primary-600 py-3 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 rounded-md"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <div className="flex items-center justify-center">
                  <ShoppingCartIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  <span>Add to Cart</span>
                </div>
              </button>
              <button
                type="button"
                className="flex-1 border border-primary-600 bg-white py-3 px-4 text-sm font-medium text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 rounded-md"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
              <button
                type="button"
                className="rounded-md p-3 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={handleAddToWishlist}
              >
                <span className="sr-only">Add to wishlist</span>
                <HeartIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Features */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Features</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-500">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            {/* Product details */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Details</h3>
              <div className="mt-2">
                <dl className="divide-y divide-gray-200">
                  {product.details.map((detail) => (
                    <div key={detail.name} className="flex justify-between py-2 text-sm">
                      <dt className="font-medium text-gray-500">{detail.name}</dt>
                      <dd className="text-gray-900">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        <div className="mt-16">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            You might also like
          </h2>
          
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group relative">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <div className="relative h-full w-full">
                    <Image
                      src={relatedProduct.imageSrc}
                      alt={relatedProduct.imageAlt}
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={relatedProduct.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {relatedProduct.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${relatedProduct.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 