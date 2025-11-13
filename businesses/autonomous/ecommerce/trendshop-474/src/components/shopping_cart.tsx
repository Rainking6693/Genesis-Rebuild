// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null);
    } catch (e: any) {
      setError(`Error adding item: ${e.message}`);
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const calculateTotalPrice = () => {
    try {
      const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(newTotalPrice);
      setError(null);
    } catch (e: any) {
      setError(`Error calculating total price: ${e.message}`);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null);
    } catch (e: any) {
      setError(`Error adding item: ${e.message}`);
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const calculateTotalPrice = () => {
    try {
      const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(newTotalPrice);
      setError(null);
    } catch (e: any) {
      setError(`Error calculating total price: ${e.message}`);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;