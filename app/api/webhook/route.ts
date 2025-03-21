import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// POST handler for handling Stripe webhook events
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    
    // Verify the webhook event
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
    
    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Failed to handle webhook' },
      { status: 500 }
    );
  }
}

// Handle checkout.session.completed event
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get the customer information from metadata
    const userId = session.metadata?.userId;
    
    if (!userId) {
      console.error('No userId found in session metadata');
      return;
    }
    
    // Retrieve session with line items to get purchased products
    const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });
    
    const lineItems = checkoutSession.line_items?.data || [];
    
    // Create or update order in Firestore
    if (session.payment_status === 'paid') {
      // Get user's cart
      const cartRef = doc(db, 'carts', userId);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const items = cartData.items || [];
        
        // Create order
        await addDoc(collection(db, 'orders'), {
          userId,
          items,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
          status: 'processing',
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          paymentId: session.payment_intent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          shippingAddress: {
            // In a real app, you would get this from the session or from your database
            fullName: session.customer_details?.name || '',
            email: session.customer_details?.email || '',
            // You'd need to capture the address during checkout and store it
          }
        });
        
        // Clear the cart after successful order
        await updateDoc(cartRef, {
          items: [],
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    throw error;
  }
}

// Handle payment_intent.succeeded event
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update order status or perform additional actions
  console.log(`PaymentIntent for ${paymentIntent.amount} succeeded.`);
}

// Handle payment_intent.payment_failed event
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update order status or notify user about payment failure
  console.log(`PaymentIntent for ${paymentIntent.amount} failed: ${paymentIntent.last_payment_error?.message}`);
} 