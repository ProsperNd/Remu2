import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/services/productService';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCard from '@/components/ProductCard';
import { ArrowRightIcon, FireIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/outline';

async function getHomePageData() {
  const flashDeals = await getProducts({ onSale: true, limit: 6 });
  const trending = await getProducts({ sortBy: 'popularity', limit: 6 });
  const newArrivals = await getProducts({ sortBy: 'newest', limit: 6 });
  const categories = await getCategories();
  
  return {
    flashDeals,
    trending,
    newArrivals,
    categories,
  };
}

export default async function Home() {
  const { flashDeals, trending, newArrivals, categories } = await getHomePageData();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[500px] bg-gradient-to-r from-primary-600 to-primary-400">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Shop Smart, Save Big
            </h1>
            <p className="mt-6 text-xl">
              Discover amazing deals on thousands of products
            </p>
            <div className="mt-10">
              <Link
                href="/products"
                className="rounded-md bg-white px-8 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-gray-100"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Flash Deals */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Flash Deals</h2>
            </div>
            <Link href="/products?onSale=true" className="flex items-center text-primary-600 hover:text-primary-500">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TagIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            </div>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Trending Now */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Link href="/products?sortBy=popularity" className="flex items-center text-primary-600 hover:text-primary-500">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <Link href="/products?sortBy=newest" className="flex items-center text-primary-600 hover:text-primary-500">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* App Features */}
        <section className="my-16 bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Fast Shipping</h3>
              <p className="mt-1 text-sm text-gray-500">2-5 business days delivery</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Secure Shopping</h3>
              <p className="mt-1 text-sm text-gray-500">100% secure payment</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Amazing Deals</h3>
              <p className="mt-1 text-sm text-gray-500">Up to 80% off</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">24/7 Support</h3>
              <p className="mt-1 text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 