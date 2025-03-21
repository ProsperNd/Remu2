import { NextResponse } from 'next/server';
import { getProducts, ProductFilter } from '@/lib/services/productService';

// GET handler for retrieving products with filtering
export async function GET(request: Request) {
  try {
    // Get search params from the request URL
    const { searchParams } = new URL(request.url);
    
    // Build filter object from search params
    const filter: ProductFilter = {};
    
    // Category filter
    const category = searchParams.get('category');
    if (category) {
      filter.categories = [category];
    }
    
    // Search query
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filter.searchQuery = searchQuery;
    }
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filter.priceRange = {};
      if (minPrice) filter.priceRange.min = Number(minPrice);
      if (maxPrice) filter.priceRange.max = Number(maxPrice);
    }
    
    // On sale filter
    const onSale = searchParams.get('onSale');
    if (onSale === 'true') {
      filter.onSale = true;
    }
    
    // In stock filter
    const inStock = searchParams.get('inStock');
    if (inStock === 'true') {
      filter.inStock = true;
    }
    
    // Sort by
    const sortBy = searchParams.get('sortBy') as ProductFilter['sortBy'];
    if (sortBy) {
      filter.sortBy = sortBy;
    }
    
    // Get products based on filter
    const products = await getProducts(filter);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 