import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/services/productService';
import { useCart } from '@/lib/context/CartContext';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.isOnSale && product.salePrice ? product.salePrice : product.price,
      image: product.images[0] || '/placeholder.jpg',
    });
  };
  
  // Calculate discount percentage if on sale
  const discountPercentage = product.isOnSale && product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Link href={`/products/${product.id}`}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              width={500}
              height={500}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </Link>
        
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </div>
        )}
        
        {product.isOnSale && product.salePrice && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          
          {/* Ratings */}
          <div className="mt-1 flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={`${
                  product.ratings > rating ? 'text-yellow-400' : 'text-gray-200'
                } h-4 w-4 flex-shrink-0`}
                aria-hidden="true"
              />
            ))}
            <p className="ml-1 text-xs text-gray-500">({product.reviewCount})</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-red-600">${product.salePrice.toFixed(2)}</span>
                <span className="ml-1 line-through text-gray-500 text-xs">${product.price.toFixed(2)}</span>
              </>
            ) : (
              `$${product.price.toFixed(2)}`
            )}
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
    </div>
  );
} 