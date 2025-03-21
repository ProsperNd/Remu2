import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getServerSession } from 'next-auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// GET handler for retrieving cart items for the authenticated user
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
    
    // Get cart data from Firestore
    const cartRef = doc(db, 'carts', userId as string);
    const cartSnapshot = await getDoc(cartRef);
    
    if (!cartSnapshot.exists()) {
      // Create an empty cart if it doesn't exist
      await setDoc(cartRef, { items: [], updatedAt: new Date() });
      return NextResponse.json({ items: [] });
    }
    
    const cartData = cartSnapshot.data();
    return NextResponse.json(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST handler for updating the cart for the authenticated user
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
    const data = await request.json();
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Validate items structure
    const items: CartItem[] = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1
    }));
    
    // Update cart in Firestore
    const cartRef = doc(db, 'carts', userId as string);
    await updateDoc(cartRef, {
      items,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
} 