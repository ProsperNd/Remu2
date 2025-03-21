import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  limit, 
  orderBy,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  inventory: number;
  ratings: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  shippingTime?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

/**
 * Get all products with optional pagination and filtering
 */
export const getProducts = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  filter?: ProductFilter,
  pageSize: number = 20
): Promise<{ products: Product[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let productsQuery = collection(db, 'products');
    let constraints = [];

    // Add filters if provided
    if (filter) {
      if (filter.category) {
        constraints.push(where('category', '==', filter.category));
      }
      
      if (filter.subcategory) {
        constraints.push(where('subcategory', '==', filter.subcategory));
      }
      
      if (filter.onSale) {
        constraints.push(where('isOnSale', '==', true));
      }
      
      if (filter.inStock) {
        constraints.push(where('inventory', '>', 0));
      }
      
      if (filter.minPrice !== undefined) {
        constraints.push(where('price', '>=', filter.minPrice));
      }
      
      if (filter.maxPrice !== undefined) {
        constraints.push(where('price', '<=', filter.maxPrice));
      }
      
      // Add sorting
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case 'price-asc':
            constraints.push(orderBy('price', 'asc'));
            break;
          case 'price-desc':
            constraints.push(orderBy('price', 'desc'));
            break;
          case 'newest':
            constraints.push(orderBy('createdAt', 'desc'));
            break;
          case 'popular':
            constraints.push(orderBy('ratings', 'desc'));
            break;
          default:
            constraints.push(orderBy('createdAt', 'desc'));
        }
      } else {
        constraints.push(orderBy('createdAt', 'desc'));
      }
    } else {
      // Default sort by newest
      constraints.push(orderBy('createdAt', 'desc'));
    }
    
    // Add pagination
    constraints.push(limit(pageSize));
    
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }
    
    const productsRef = query(productsQuery, ...constraints);
    const snapshot = await getDocs(productsRef);
    
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        inventory: data.inventory,
        ratings: data.ratings,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        isOnSale: data.isOnSale,
        shippingTime: data.shippingTime,
        tags: data.tags,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    return {
      products,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id);
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
      salePrice: data.salePrice,
      images: data.images,
      category: data.category,
      subcategory: data.subcategory,
      inventory: data.inventory,
      ratings: data.ratings,
      reviewCount: data.reviewCount,
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      isOnSale: data.isOnSale,
      shippingTime: data.shippingTime,
      tags: data.tags,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (count: number = 8): Promise<Product[]> => {
  try {
    const productsRef = query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        inventory: data.inventory,
        ratings: data.ratings,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        isOnSale: data.isOnSale,
        shippingTime: data.shippingTime,
        tags: data.tags,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

/**
 * Get products on sale
 */
export const getProductsOnSale = async (count: number = 8): Promise<Product[]> => {
  try {
    const productsRef = query(
      collection(db, 'products'),
      where('isOnSale', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        inventory: data.inventory,
        ratings: data.ratings,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        isOnSale: data.isOnSale,
        shippingTime: data.shippingTime,
        tags: data.tags,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products on sale:', error);
    throw error;
  }
};

/**
 * Get new arrivals
 */
export const getNewArrivals = async (count: number = 8): Promise<Product[]> => {
  try {
    const productsRef = query(
      collection(db, 'products'),
      where('isNew', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        inventory: data.inventory,
        ratings: data.ratings,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        isOnSale: data.isOnSale,
        shippingTime: data.shippingTime,
        tags: data.tags,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    throw error;
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (searchTerm: string, limit: number = 20): Promise<Product[]> => {
  try {
    // Firebase doesn't support text search, so we'll fetch all products and filter client-side
    // For a production app, you'd want to use a service like Algolia
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    const products: Product[] = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const nameMatch = data.name.toLowerCase().includes(searchTermLower);
      const descMatch = data.description.toLowerCase().includes(searchTermLower);
      const tagMatch = data.tags && data.tags.some((tag: string) => tag.toLowerCase().includes(searchTermLower));
      
      if (nameMatch || descMatch || tagMatch) {
        products.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          salePrice: data.salePrice,
          images: data.images,
          category: data.category,
          subcategory: data.subcategory,
          inventory: data.inventory,
          ratings: data.ratings,
          reviewCount: data.reviewCount,
          isNew: data.isNew,
          isFeatured: data.isFeatured,
          isOnSale: data.isOnSale,
          shippingTime: data.shippingTime,
          tags: data.tags,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      }
    });
    
    return products.slice(0, limit);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  category: string,
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = 20
): Promise<{ products: Product[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let productsQuery: any;
    
    if (lastVisible) {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(productsQuery);
    const products: Product[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        images: data.images,
        category: data.category,
        subcategory: data.subcategory,
        inventory: data.inventory,
        ratings: data.ratings,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
        isOnSale: data.isOnSale,
        shippingTime: data.shippingTime,
        tags: data.tags,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });
    
    const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    return {
      products,
      lastVisible: newLastVisible
    };
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

/**
 * Upload a product image to Firebase Storage
 */
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

/**
 * Add a new product
 */
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  id: string, 
  productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 