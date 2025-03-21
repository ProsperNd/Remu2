import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/services/productService';

// GET handler for retrieving products with filtering and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter = {
      categories: searchParams.get('categories')?.split(','),
      searchQuery: searchParams.get('search') || undefined,
      priceRange: {
        min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      },
      onSale: searchParams.get('onSale') === 'true',
      inStock: searchParams.get('inStock') === 'true',
      sortBy: searchParams.get('sortBy') as any,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    };

    const products = await getProducts(filter);
    
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 