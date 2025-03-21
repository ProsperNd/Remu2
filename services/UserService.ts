import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  FirebaseFirestore
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Address } from './OrderService';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  addresses?: {
    shipping?: Address;
    billing?: Address;
  };
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private usersCollection = collection(db, 'users');

  async registerUser(email: string, password: string, displayName: string): Promise<User> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Set the display name
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email || email,
        displayName,
        photoURL: firebaseUser.photoURL || undefined,
        phoneNumber: firebaseUser.phoneNumber || undefined,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const userRef = doc(this.usersCollection, firebaseUser.uid);
      await setDoc(userRef, userData);
      
      return {
        id: firebaseUser.uid,
        ...userData
      };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }
  
  async loginUser(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }
  
  async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  }
  
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
        addresses: data.addresses,
        isAdmin: data.isAdmin,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      return null;
    }
    
    return this.getUserById(firebaseUser.uid);
  }
  
  async updateUserProfile(
    userId: string, 
    data: {
      displayName?: string;
      photoURL?: string;
      phoneNumber?: string;
    }
  ): Promise<User> {
    try {
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      // Update Firestore document
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Update Auth profile if the user is the current user
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.uid === userId) {
        await updateProfile(firebaseUser, {
          displayName: data.displayName,
          photoURL: data.photoURL
        });
      }
      
      // Get the updated user
      const updatedUserDoc = await getDoc(userRef);
      const updatedData = updatedUserDoc.data();
      
      return {
        id: updatedUserDoc.id,
        email: updatedData.email,
        displayName: updatedData.displayName,
        photoURL: updatedData.photoURL,
        phoneNumber: updatedData.phoneNumber,
        addresses: updatedData.addresses,
        isAdmin: updatedData.isAdmin,
        createdAt: updatedData.createdAt.toDate(),
        updatedAt: updatedData.updatedAt.toDate()
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
  
  async updateUserEmail(userId: string, newEmail: string, password: string): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser || firebaseUser.uid !== userId) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate user before updating email
      await signInWithEmailAndPassword(auth, firebaseUser.email || '', password);
      
      // Update email in Auth
      await updateEmail(firebaseUser, newEmail);
      
      // Update email in Firestore
      const userRef = doc(this.usersCollection, userId);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating user email:", error);
      throw error;
    }
  }
  
  async updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser || firebaseUser.uid !== userId) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate user before updating password
      await signInWithEmailAndPassword(auth, firebaseUser.email || '', currentPassword);
      
      // Update password in Auth
      await updatePassword(firebaseUser, newPassword);
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  }
  
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }
  
  async updateUserAddresses(
    userId: string, 
    addresses: {
      shipping?: Address;
      billing?: Address;
    }
  ): Promise<User> {
    try {
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      await updateDoc(userRef, {
        addresses,
        updatedAt: new Date()
      });
      
      // Get the updated user
      const updatedUserDoc = await getDoc(userRef);
      const data = updatedUserDoc.data();
      
      return {
        id: updatedUserDoc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        phoneNumber: data.phoneNumber,
        addresses: data.addresses,
        isAdmin: data.isAdmin,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } catch (error) {
      console.error("Error updating user addresses:", error);
      throw error;
    }
  }
  
  async checkIfAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user ? user.isAdmin : false;
    } catch (error) {
      console.error("Error checking if user is admin:", error);
      return false;
    }
  }
}

export default new UserService(); 