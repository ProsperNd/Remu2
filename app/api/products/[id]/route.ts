import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/services/productService';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET handler for retrieving a single product by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Get product by ID
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 