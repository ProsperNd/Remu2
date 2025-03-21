import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  FirebaseFirestore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  onSale: boolean;
  salePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  search?: string;
}

export interface PaginatedProducts {
  products: Product[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

class ProductService {
  private productsCollection = collection(db, 'products');

  async getProducts(
    filter: ProductFilter = {}, 
    pageSize: number = 12,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<PaginatedProducts> {
    let q = query(this.productsCollection);
    
    // Apply category filter
    if (filter.categories && filter.categories.length > 0) {
      q = query(q, where('category', 'in', filter.categories));
    }
    
    // Apply price range filter
    if (filter.minPrice !== undefined) {
      q = query(q, where('price', '>=', filter.minPrice));
    }
    
    if (filter.maxPrice !== undefined) {
      q = query(q, where('price', '<=', filter.maxPrice));
    }
    
    // Apply in stock filter
    if (filter.inStock !== undefined) {
      q = query(q, where('inStock', '==', filter.inStock));
    }
    
    // Apply on sale filter
    if (filter.onSale !== undefined) {
      q = query(q, where('onSale', '==', filter.onSale));
    }
    
    // Apply sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          q = query(q, orderBy('price', 'asc'));
          break;
        case 'price-desc':
          q = query(q, orderBy('price', 'desc'));
          break;
        case 'newest':
          q = query(q, orderBy('createdAt', 'desc'));
          break;
        case 'popular':
          q = query(q, orderBy('popularity', 'desc'));
          break;
        default:
          q = query(q, orderBy('createdAt', 'desc'));
      }
    } else {
      // Default sort by newest
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc), limit(pageSize));
    } else {
      q = query(q, limit(pageSize));
    }
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        category: data.category,
        inStock: data.inStock,
        onSale: data.onSale,
        salePrice: data.salePrice,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    const lastVisible = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;
    
    const hasMore = querySnapshot.docs.length === pageSize;
    
    return {
      products,
      lastDoc: lastVisible,
      hasMore
    };
  }
  
  async getProductById(id: string): Promise<Product | null> {
    const productRef = doc(this.productsCollection, id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      return null;
    }
    
    const data = productDoc.data();
    return {
      id: productDoc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images,
      category: data.category,
      inStock: data.inStock,
      onSale: data.onSale,
      salePrice: data.salePrice,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
  
  async searchProducts(searchTerm: string, limit: number = 5): Promise<Product[]> {
    // Note: Firestore doesn't support native text search
    // For a real app, consider using Algolia or similar
    // This is a simplified version that just checks if the name starts with the search term
    const q = query(
      this.productsCollection,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        category: data.category,
        inStock: data.inStock,
        onSale: data.onSale,
        salePrice: data.salePrice,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return products;
  }
  
  async getCategories(): Promise<string[]> {
    const q = query(collection(db, 'categories'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().name);
  }
}

export default new ProductService(); 