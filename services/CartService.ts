import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  arrayRemove, 
  increment,
  runTransaction,
  FirebaseFirestore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductService, { Product } from './ProductService';

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

class CartService {
  private cartsCollection = collection(db, 'carts');

  async getCart(userId: string): Promise<Cart | null> {
    const cartRef = doc(this.cartsCollection, userId);
    const cartDoc = await getDoc(cartRef);
    
    if (!cartDoc.exists()) {
      // Create a new cart if it doesn't exist
      const newCart: Omit<Cart, 'id'> = {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date()
      };
      
      await setDoc(cartRef, newCart);
      return { ...newCart, id: userId };
    }
    
    const data = cartDoc.data();
    return {
      id: cartDoc.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      updatedAt: data.updatedAt.toDate()
    };
  }
  
  async addToCart(userId: string, product: Product, quantity: number = 1): Promise<Cart> {
    const cartRef = doc(this.cartsCollection, userId);
    const cartDoc = await getDoc(cartRef);
    
    // Create cart if it doesn't exist
    if (!cartDoc.exists()) {
      const newCart: Omit<Cart, 'id'> = {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date()
      };
      await setDoc(cartRef, newCart);
    }
    
    // Determine the actual price (sale price or regular price)
    const itemPrice = product.onSale && product.salePrice !== undefined 
      ? product.salePrice 
      : product.price;
    
    try {
      // Use a transaction to ensure data consistency
      return await runTransaction(db, async (transaction) => {
        const updatedCartDoc = await transaction.get(cartRef);
        const cartData = updatedCartDoc.data() || { items: [], total: 0 };
        const existingItemIndex = cartData.items.findIndex(
          (item: CartItem) => item.productId === product.id
        );
        
        let updatedItems = [...cartData.items];
        let updatedTotal = cartData.total || 0;
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const existingItem = updatedItems[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;
          
          // Update the total (remove old item total, add new item total)
          updatedTotal = updatedTotal - (existingItem.quantity * existingItem.price) + (newQuantity * itemPrice);
          
          // Update the item
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            price: itemPrice // Update price in case it changed
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            quantity,
            price: itemPrice,
            name: product.name,
            image: product.images[0] || ''
          };
          
          updatedItems.push(newItem);
          updatedTotal += itemPrice * quantity;
        }
        
        const updatedCart = {
          userId,
          items: updatedItems,
          total: updatedTotal,
          updatedAt: new Date()
        };
        
        transaction.set(cartRef, updatedCart);
        
        return {
          id: userId,
          ...updatedCart
        };
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error('Failed to update cart');
    }
  }
  
  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cartRef = doc(this.cartsCollection, userId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        const cartDoc = await transaction.get(cartRef);
        
        if (!cartDoc.exists()) {
          throw new Error('Cart not found');
        }
        
        const cartData = cartDoc.data();
        const items = cartData.items;
        const itemIndex = items.findIndex((item: CartItem) => item.productId === productId);
        
        if (itemIndex === -1) {
          throw new Error('Product not found in cart');
        }
        
        const item = items[itemIndex];
        const updatedItems = [...items];
        
        if (quantity <= 0) {
          // Remove item from cart if quantity is 0 or negative
          updatedItems.splice(itemIndex, 1);
        } else {
          // Update item quantity
          updatedItems[itemIndex] = {
            ...item,
            quantity
          };
        }
        
        // Recalculate total
        const total = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        const updatedCart = {
          userId,
          items: updatedItems,
          total,
          updatedAt: new Date()
        };
        
        transaction.set(cartRef, updatedCart);
        
        return {
          id: userId,
          ...updatedCart
        };
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw new Error('Failed to update cart item quantity');
    }
  }
  
  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cartRef = doc(this.cartsCollection, userId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        const cartDoc = await transaction.get(cartRef);
        
        if (!cartDoc.exists()) {
          throw new Error('Cart not found');
        }
        
        const cartData = cartDoc.data();
        const items = cartData.items;
        const updatedItems = items.filter((item: CartItem) => item.productId !== productId);
        
        // Recalculate total
        const total = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        const updatedCart = {
          userId,
          items: updatedItems,
          total,
          updatedAt: new Date()
        };
        
        transaction.set(cartRef, updatedCart);
        
        return {
          id: userId,
          ...updatedCart
        };
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw new Error('Failed to remove item from cart');
    }
  }
  
  async clearCart(userId: string): Promise<void> {
    const cartRef = doc(this.cartsCollection, userId);
    
    try {
      await setDoc(cartRef, {
        userId,
        items: [],
        total: 0,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error('Failed to clear cart');
    }
  }
}

export default new CartService(); 