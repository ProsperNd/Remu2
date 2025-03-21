import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  FirebaseFirestore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CartService, { Cart, CartItem } from './CartService';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem extends CartItem {
  // Extended with additional fields if needed
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

class OrderService {
  private ordersCollection = collection(db, 'orders');

  async createOrder(
    userId: string, 
    cart: Cart, 
    shippingAddress: Address, 
    billingAddress: Address,
    paymentId?: string
  ): Promise<Order> {
    try {
      // Create order document
      const orderData = {
        userId,
        items: cart.items,
        total: cart.total,
        status: OrderStatus.PENDING,
        paymentId,
        shippingAddress,
        billingAddress,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const orderRef = await addDoc(this.ordersCollection, orderData);
      
      // Clear the user's cart after creating the order
      await CartService.clearCart(userId);
      
      return {
        id: orderRef.id,
        ...orderData
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error('Failed to create order');
    }
  }
  
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        return null;
      }
      
      const data = orderDoc.data();
      return {
        id: orderDoc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        status: data.status,
        paymentId: data.paymentId,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } catch (error) {
      console.error("Error getting order:", error);
      throw new Error('Failed to get order');
    }
  }
  
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          total: data.total,
          status: data.status,
          paymentId: data.paymentId,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      });
      
      return orders;
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw new Error('Failed to get user orders');
    }
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      await setDoc(orderRef, {
        status,
        updatedAt: new Date()
      }, { merge: true });
      
      // Get the updated order
      const updatedOrderDoc = await getDoc(orderRef);
      const data = updatedOrderDoc.data();
      
      return {
        id: updatedOrderDoc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        status: data.status,
        paymentId: data.paymentId,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error('Failed to update order status');
    }
  }
  
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection,
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items,
          total: data.total,
          status: data.status,
          paymentId: data.paymentId,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      });
      
      return orders;
    } catch (error) {
      console.error("Error getting recent orders:", error);
      throw new Error('Failed to get recent orders');
    }
  }
}

export default new OrderService(); 