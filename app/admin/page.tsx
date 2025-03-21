'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

// Mock data for the admin dashboard
const summaryStats = [
  {
    id: 1,
    name: 'Total Products',
    value: '1,284',
    change: '+12.5%',
    changeType: 'increase',
    icon: ShoppingBagIcon,
    href: '/admin/products',
  },
  {
    id: 2,
    name: 'Total Customers',
    value: '8,591',
    change: '+5.2%',
    changeType: 'increase',
    icon: UsersIcon,
    href: '/admin/customers',
  },
  {
    id: 3,
    name: 'Total Revenue',
    value: '$452,694',
    change: '+18.3%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
    href: '/admin/revenue',
  },
  {
    id: 4,
    name: 'Active Orders',
    value: '235',
    change: '-2.1%',
    changeType: 'decrease',
    icon: ChartBarIcon,
    href: '/admin/orders',
  },
];

// Mock recent orders
const recentOrders = [
  {
    id: 'ORD-1234',
    customer: 'John Doe',
    date: '2023-09-15',
    status: 'Completed',
    total: '$124.99',
  },
  {
    id: 'ORD-1235',
    customer: 'Sarah Smith',
    date: '2023-09-15',
    status: 'Processing',
    total: '$89.95',
  },
  {
    id: 'ORD-1236',
    customer: 'Michael Johnson',
    date: '2023-09-14',
    status: 'Shipped',
    total: '$214.50',
  },
  {
    id: 'ORD-1237',
    customer: 'Emma Williams',
    date: '2023-09-14',
    status: 'Pending',
    total: '$54.25',
  },
  {
    id: 'ORD-1238',
    customer: 'Robert Brown',
    date: '2023-09-13',
    status: 'Completed',
    total: '$175.00',
  },
];

// Mock recent products
const recentProducts = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: '$39.99',
    stock: 124,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46',
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    price: '$149.99',
    stock: 89,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
  },
  {
    id: 3,
    name: 'Home Security Camera',
    category: 'Electronics',
    price: '$59.99',
    stock: 56,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6914fd',
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Kitchen',
    price: '$24.99',
    stock: 215,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary-600 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <div
                key={stat.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {stat.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span
                        className={`inline-flex text-xs font-semibold ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-gray-500 ml-1">from last month</span>
                    </div>
                    <div className="text-sm">
                      <Link
                        href={stat.href}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders and Products */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Recent Orders */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
                <div className="flex space-x-2">
                  <Link
                    href="/admin/products/add"
                    className="inline-flex items-center rounded border border-transparent bg-primary-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                    Add
                  </Link>
                  <Link
                    href="/admin/products"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.price}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              product.stock > 100
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 