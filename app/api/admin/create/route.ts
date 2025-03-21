import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { uid, email } = await request.json();

    // Set custom claims for admin
    await auth.setCustomUserClaims(uid, { admin: true });

    // Update user document in Firestore
    await db.collection('users').doc(uid).update({
      isAdmin: true,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
} 