'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// Type definitions for cart items
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

// Context interface
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);
  
  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        // If item is new, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  
  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Update the quantity of an item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Calculate the total price of items in the cart
  const getCartTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };
  
  // Get the total number of items in the cart
  const getCartCount = () => {
    return items.reduce((count, item) => {
      return count + (item.quantity || 1);
    }, 0);
  };
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}; 