'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent checkout if cart is empty
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // In a real app, this would redirect to the checkout page
    toast.success('Proceeding to checkout...');
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
              <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart items */}
            <div className="lg:col-span-7">
              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/products/${item.id}`}>{item.name}</Link>
                          </h3>
                          <p className="ml-4">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 p-1"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          >
                            <MinusIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                          </button>
                          <span className="mx-2 text-gray-700 text-base">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 p-1"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <PlusIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            className="font-medium text-primary-600 hover:text-primary-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <button
                  type="button"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:col-span-5 lg:mt-0">
              <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">${getCartTotal().toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Shipping estimate</p>
                    <p className="text-sm font-medium text-gray-900">$5.00</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Tax estimate</p>
                    <p className="text-sm font-medium text-gray-900">${(getCartTotal() * 0.085).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-medium text-gray-900">Order total</p>
                    <p className="text-base font-medium text-gray-900">
                      ${(getCartTotal() + 5 + getCartTotal() * 0.085).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={handleCheckout}
                  >
                    <div className="flex items-center justify-center">
                      <span>Proceed to Checkout</span>
                      <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 