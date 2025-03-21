'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/services/productService';
import { useCart } from '@/lib/context/CartContext';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlist, setIsWishlist] = useState(false);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.isOnSale && product.salePrice ? product.salePrice : product.price,
      image: product.images[0] || '/placeholder.jpg',
    });
  };
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlist(!isWishlist);
  };
  
  // Calculate discount percentage if on sale
  const discountPercentage = product.isOnSale && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          width={300}
          height={300}
        />
        <button
          onClick={toggleWishlist}
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-100"
        >
          {isWishlist ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {discountPercentage > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">
          {product.category}
        </p>
        
        {/* Ratings */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900">
                {product.isOnSale && product.salePrice ? (
                  <>
                    <span className="text-red-600">${product.salePrice.toFixed(2)}</span>
                    <span className="ml-1 line-through text-gray-500 text-xs">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </span>
            </div>
          </div>
          
          {product.shippingTime && (
            <p className="mt-1 text-xs text-gray-500">{product.shippingTime} shipping</p>
          )}
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-4 w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <ShoppingCartIcon className="h-4 w-4 mr-2" />
        Add to Cart
      </button>
    </Link>
  );
} 