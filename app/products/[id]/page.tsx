'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getProductById, Product } from '@/lib/services/productService';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            setSelectedImage(productData.images[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Add product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.isOnSale && product.salePrice ? product.salePrice : product.price,
        image: product.images[0] || '/placeholder.jpg',
      });
    }

    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <p className="mt-2 text-gray-600">The product you're looking for does not exist or has been removed.</p>
      </div>
    );
  }

  // Calculate discount percentage if on sale
  const discountPercentage = product.isOnSale && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={selectedImage || '/placeholder.jpg'}
                alt={product.name}
                className="h-full w-full object-cover object-center"
                width={800}
                height={800}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={classNames(
                      image === selectedImage ? 'ring-2 ring-primary-500' : 'ring-1 ring-gray-200',
                      'relative flex h-20 cursor-pointer items-center justify-center rounded-md bg-white'
                    )}
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                        width={100}
                        height={100}
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0 lg:max-w-lg lg:self-start">
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
              <div className="mt-2">
                {product.isOnSale && product.salePrice ? (
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-gray-900">${product.salePrice.toFixed(2)}</p>
                    <p className="ml-3 text-lg font-medium text-gray-500 line-through">${product.price.toFixed(2)}</p>
                    <p className="ml-3 text-sm font-medium text-red-600">Save {discountPercentage}%</p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                )}
              </div>

              {/* Reviews */}
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.ratings > rating ? 'text-yellow-400' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{product.reviewCount} reviews</p>
                </div>
              </div>

              {/* Stock status */}
              <div className="mt-4">
                {product.inventory > 0 ? (
                  <p className="text-sm text-green-600">In stock - {product.inventory} available</p>
                ) : (
                  <p className="text-sm text-red-600">Out of stock</p>
                )}
                {product.shippingTime && (
                  <p className="mt-1 text-sm text-gray-500">
                    Shipping: {product.shippingTime}
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-base text-gray-500">{product.description}</p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and add to cart */}
              <div className="mt-8">
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                      value={quantity}
                      onChange={handleQuantityChange}
                      disabled={product.inventory === 0}
                    >
                      {[...Array(Math.min(10, product.inventory || 0))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.inventory === 0}
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="rounded-md bg-white px-3 py-3 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <HeartIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 