import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getServerSession } from 'next-auth';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

// GET handler for retrieving orders for the authenticated user
export async function GET(request: Request) {
  try {
    // Get the current authenticated user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.email;
    
    // Query orders from Firestore
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const ordersSnapshot = await getDocs(q);
    
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new order for the authenticated user
export async function POST(request: Request) {
  try {
    // Get the current authenticated user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.email;
    
    // Get request body
    const data: OrderData = await request.json();
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }
    
    // Create order in Firestore
    const orderRef = await addDoc(collection(db, 'orders'), {
      userId,
      items: data.items,
      totalAmount: data.totalAmount,
      status: data.status || 'pending',
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return NextResponse.json({
      success: true,
      orderId: orderRef.id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 