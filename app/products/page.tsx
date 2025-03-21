'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories, ProductFilter, Product } from '@/lib/services/productService';
import ProductFilterComponent from '@/components/ProductFilter';
import { FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filter from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const onSale = searchParams.get('onSale') === 'true';
    const inStock = searchParams.get('inStock') === 'true';
    const sortBy = searchParams.get('sortBy') as ProductFilter['sortBy'] || undefined;
    
    const initialFilter: ProductFilter = {};
    
    if (category) initialFilter.categories = [category];
    if (searchQuery) initialFilter.searchQuery = searchQuery;
    if (minPrice) initialFilter.priceRange = { min: Number(minPrice), ...(initialFilter.priceRange || {}) };
    if (maxPrice) initialFilter.priceRange = { max: Number(maxPrice), ...(initialFilter.priceRange || {}) };
    if (onSale) initialFilter.onSale = true;
    if (inStock) initialFilter.inStock = true;
    if (sortBy) initialFilter.sortBy = sortBy;
    
    setFilter(initialFilter);
  }, [searchParams]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products when filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsList = await getProducts(filter);
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filter]);

  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {filter.searchQuery 
              ? `Search results for "${filter.searchQuery}"` 
              : filter.categories && filter.categories.length > 0 
                ? filter.categories[0] 
                : 'All Products'}
          </h1>
          
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 lg:hidden"
              onClick={toggleFilters}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="pt-6 pb-10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <ProductFilterComponent 
                currentFilter={filter} 
                onChange={handleFilterChange} 
              />
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <h2 className="text-lg font-medium text-gray-900">No products found</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your filters or search criteria.
                  </p>
                  <button 
                    onClick={() => setFilter({})} 
                    className="mt-4 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      className="group"
                    >
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <Image
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                          width={400}
                          height={400}
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">{product.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                        </div>
                        <div>
                          {product.isOnSale && product.salePrice ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">${product.salePrice.toFixed(2)}</p>
                              <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 