import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { ProductFilter as ProductFilterType } from '@/lib/services/productService';

// Sample categories - in a real app, these would be fetched from the database
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'toys', name: 'Toys & Games' },
];

interface ProductFilterProps {
  currentFilter: ProductFilterType;
  onChange: (filter: ProductFilterType) => void;
}

export default function ProductFilter({ currentFilter, onChange }: ProductFilterProps) {
  const [filter, setFilter] = useState<ProductFilterType>(currentFilter);
  
  // Update internal filter when currentFilter changes (e.g., from URL params)
  useEffect(() => {
    setFilter(currentFilter);
  }, [currentFilter]);

  const handleCategoryClick = (categoryId: string) => {
    const newFilter = { ...filter };
    
    if (newFilter.category === categoryId) {
      delete newFilter.category;
    } else {
      newFilter.category = categoryId;
    }
    
    setFilter(newFilter);
    onChange(newFilter);
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const newFilter = { ...filter };
    
    if (value === '') {
      delete newFilter[field];
    } else {
      newFilter[field] = Number(value);
    }
    
    setFilter(newFilter);
  };

  const handlePriceApply = () => {
    onChange(filter);
  };

  const handleCheckboxChange = (field: 'onSale' | 'inStock', checked: boolean) => {
    const newFilter = { ...filter };
    
    if (checked) {
      newFilter[field] = true;
    } else {
      delete newFilter[field];
    }
    
    setFilter(newFilter);
    onChange(newFilter);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ProductFilterType['sortBy'];
    const newFilter = { ...filter, sortBy: value };
    setFilter(newFilter);
    onChange(newFilter);
  };

  const clearAllFilters = () => {
    const newFilter = { sortBy: filter.sortBy };
    setFilter(newFilter);
    onChange(newFilter);
  };

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          type="button"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
          onClick={clearAllFilters}
        >
          Clear all filters
        </button>
      </div>

      {/* Sort by dropdown */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-sm font-medium text-gray-900">Sort By</h3>
        <div className="mt-2">
          <select
            id="sortBy"
            name="sortBy"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={filter.sortBy || 'newest'}
            onChange={handleSortChange}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Category</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      name={`category-${category.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={filter.category === category.id}
                      onChange={() => handleCategoryClick(category.id)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Price filter */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Price</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    id="minPrice"
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={filter.minPrice || ''}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    id="maxPrice"
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={filter.maxPrice || ''}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={handlePriceApply}
                >
                  Apply
                </button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* More filters */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">More Options</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="onSale"
                    name="onSale"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={!!filter.onSale}
                    onChange={(e) => handleCheckboxChange('onSale', e.target.checked)}
                  />
                  <label htmlFor="onSale" className="ml-3 text-sm text-gray-600">
                    On Sale
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="inStock"
                    name="inStock"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={!!filter.inStock}
                    onChange={(e) => handleCheckboxChange('inStock', e.target.checked)}
                  />
                  <label htmlFor="inStock" className="ml-3 text-sm text-gray-600">
                    In Stock
                  </label>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
} 