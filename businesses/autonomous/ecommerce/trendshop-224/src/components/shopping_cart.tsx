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
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
    } catch (e: any) {
      console.error("Error calculating total:", e);
      setError("Error calculating total. Please try again.");
    }
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Error adding item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Error removing item from cart. Please try again.");
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
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Error updating quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      <p>Total: ${total.toFixed(2)}</p>
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
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
    } catch (e: any) {
      console.error("Error calculating total:", e);
      setError("Error calculating total. Please try again.");
    }
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Error adding item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Error removing item from cart. Please try again.");
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
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Error updating quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;